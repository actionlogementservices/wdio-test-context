/**
 * **Test Context** to be populated and passed to WDIO specs.
 * @module
 * @category public
 */

import fs from 'node:fs';
import path from 'node:path';

import { faker } from '@faker-js/faker/locale/fr';
import merge from 'lodash.merge';
import { SevereServiceError } from 'webdriverio';

import { MailService } from './mail-service.js';
import { logger } from './logger.js';

/** @typedef {import('./types.js').TestEnvironmentConfiguration} TestEnvironmentConfiguration */
/** @typedef {import('./types.js').TestUser} TestUser */
/** @typedef {import('./types.js').MailProviderName} MailProviderName */
/** @typedef {import('./types.js').DataGenerator} DataGenerator */
/** @typedef {import('./types.js').LogLevel} LogLevel */

export const defaultDatasetName = 'default';
const defaultRecordedUsersFilename = 'users.json';
/** @type {MailProviderName} */ const defaultMailProviderName = 'maildrop';

/**
 * Implements **Test Context** with data to pass to WDIO specs.
 */
export class TestContext {
  /** Test user @type {TestUser} */ user;
  /** Mail service @type {MailService} */ mailService;

  /** Test environments @private @type {Map<string, TestEnvironmentConfiguration>} */
  _environments = new Map();
  /** Mail provider name @private @type {MailProviderName} */ _mailProviderName;
  /** data folder @private @type {string} */ _dataFolder;
  /** log folder @private @type {string} */ _logFolder;
  /** data folder @private @type {string} */ _recordedUsersFilepath;
  /** custom data generator @private @type {DataGenerator} */ _dataGenerator;
  /** default dataset name @private @type {string} */ _defaultDatasetName;

  /**
   * Implements a test context with environments and dataset in webdriverio.
   * @param {string} name name of the environment (defined by TARGET_ENV environment variable)
   * @param {Record<string, any>} parameters custom parameters (like 'url')
   * @param {import('./types.js').EnvironmentOptions} [environmentOptions] custom options
   * @returns {TestContext}
   */
  setEnvironment(name, parameters, environmentOptions) {
    const options = environmentOptions ?? { perEnvironmentData: false };
    this._environments.set(name, { parameters: new Map(Object.entries(parameters)), options });
    return this;
  }

  /**
   * Defines a custom function that adds data to the current dataset
   * @param {DataGenerator} dataGenerator
   * @returns {TestContext}
   */
  setDataGenerator(dataGenerator) {
    this._dataGenerator = dataGenerator;
    return this;
  }

  /**
   * Defines the **default dataset** when no DATASET environment variable is specified.
   * @param {string} name name ot the default dataset
   * @returns {TestContext}
   */
  setDefaultDataset(name) {
    this._defaultDatasetName = name ?? defaultDatasetName;
    return this;
  }

  /**
   * Defines the **disposable email provider**. Overriden by MAILPROVIDER environment variable. **maildrop** is default value.
   * @param {MailProviderName} name name of the disposable mail service provider
   * @returns {TestContext}
   */
  setMailProvider(name) {
    this._mailProviderName = /** @type {import('./types.js').MailProviderName} */ (
      process.env.MAILPROVIDER ?? name
    );
    return this;
  }

  /**
   * Sets the logging level.
   * @param {LogLevel} level logging level
   */
  setLogLevel(level) {
    logger.setLogLevel(level);
  }

  /**
   * Initializes the data of the test context.
   * @returns {TestContext}
   */
  initialize() {
    // email provider
    this.mailService = new MailService(this._mailProviderName ?? defaultMailProviderName);
    // data folder
    this._dataFolder =
      (this.environment.options.perEnvironmentData ?? false)
        ? path.join(process.cwd(), 'data', this.environmentName)
        : path.join(process.cwd(), 'data');
    this._logFolder = path.join(process.cwd(), 'data', 'log');
    this._recordedUsersFilepath = path.join(this._logFolder, defaultRecordedUsersFilename);
    const datasetFilepath = path.join(this._dataFolder, `${this.dataset}.json`);
    if (!fs.existsSync(datasetFilepath))
      throw new SevereServiceError(`Unable to find dataset file '${datasetFilepath}'!`);
    // generate random user
    const user = this._generateRandomUser(this.mailService);
    // generate custom data
    const customData = this._dataGenerator(this);
    // load dataset
    const data = JSON.parse(fs.readFileSync(datasetFilepath, 'utf8'));
    // add dataset to test context
    merge(this, data);
    // add generated user to test context
    merge(this, { user });
    // add custom data to test context
    merge(this, customData);
    // EMAIL environment variable to force a previous recorder user
    const email = process.env.EMAIL;
    if (email) {
      merge(this, { user: this._getPreviouslyRecordedUser(email) });
    }
    return this;
  }

  /**
   * Retrieves the specified parameter of the current environment.
   * @param {string} name
   * @param {boolean} [mandatory]
   * @returns {any | undefined}
   */
  getParameter(name, mandatory) {
    if (mandatory && !this.environment.parameters.has(name))
      throw new Error(`Parameter '${name}' was not defined for '${this.environmentName}' environment!`);
    return this.environment.parameters.get(name);
  }

  /**
   * Retrieves the name of the current environment.
   * @returns {string}
   */
  get environmentName() {
    if (this._environments.size === 0)
      throw new SevereServiceError('At least one environment must be set! Check your environment.js file.');
    const firstEnvironmentName = this._environments.keys().next().value;
    return (process.env.TARGET_ENV || firstEnvironmentName).toLowerCase();
  }

  /**
   * Retrieves the configuration of the current environment.
   * @returns {TestEnvironmentConfiguration}
   */
  get environment() {
    return this._environments.get(this.environmentName);
  }

  /**
   * The current dataset.
   * @returns {string}
   */
  get dataset() {
    return process.env.DATASET || this._defaultDatasetName;
  }

  /**
   * Is the current dataset the default one.
   * @returns {boolean}
   */
  get isDefaultDataset() {
    return this._defaultDatasetName === this.dataset;
  }

  /**
   * Generates a random user.
   * @private
   * @param {MailService} mailService
   * @returns {TestUser}
   */
  _generateRandomUser(mailService) {
    if (!process.env.USER_PASSWORD)
      throw new SevereServiceError(
        `The default password for generated user was not provided with the 'USER_PASSWORD' environment variable!`
      );
    // random user
    const sex = /** @type {'male' | 'female'} */ (faker.person.sexType());
    const gender = sex === 'female' ? 'Madame' : 'Monsieur';
    const lastname = faker.person.lastName().toUpperCase();
    const firstname = faker.person.firstName(sex);
    // random email
    const domain = faker.helpers.arrayElement(mailService.domains);
    const suffix = new Date().getMilliseconds();
    const email = `${firstname[0]}${lastname}-${suffix}@${domain}`
      .normalize('NFD')
      .replaceAll(/[\u0300-\u036F]/g, '')
      .replaceAll(new RegExp(' ', 'g'), '')
      .toLowerCase();
    return { gender, lastname, firstname, email, password: process.env.USER_PASSWORD };
  }

  /**
   * Retrieves the previously recorded user.
   * @private
   * @param {string} email
   * @returns {TestUser}
   */
  _getPreviouslyRecordedUser(email) {
    /** @type {import('./types.js').RecordedTestUser[]} */
    const users = JSON.parse(fs.readFileSync(this._recordedUsersFilepath, 'utf8'));
    const lastUser = email?.toLowerCase() === 'last';
    const previouslyRecordedUser = lastUser
      ? users.findLast(a => a.environment === this.environmentName)
      : users.findLast(a => a.email === email && a.environment === this.environmentName);
    if (!previouslyRecordedUser) {
      const userInfo = lastUser ? 'last recorded user' : `previously recorded user with email '${email}'`;
      throw new SevereServiceError(
        `Unable to find ${userInfo} for '${this.environmentName}' in the ${defaultRecordedUsersFilename} file!`
      );
    }
    delete previouslyRecordedUser.dataset;
    delete previouslyRecordedUser.date;
    delete previouslyRecordedUser.environment;
    return previouslyRecordedUser;
  }

  /**
   * Records the current created user.
   */
  recordTestUser() {
    if (!fs.existsSync(this._recordedUsersFilepath)) {
      fs.mkdirSync(this._logFolder, { recursive: true });
      fs.writeFileSync(this._recordedUsersFilepath, JSON.stringify([]));
    }
    const { firstname, lastname, gender, email, password } = this.user;
    const environment = this.environmentName;
    const dataset = this.dataset;
    const date = new Date().toLocaleString('fr-FR');
    const users = JSON.parse(fs.readFileSync(this._recordedUsersFilepath, 'utf8'));
    users.push({ environment, dataset, date, lastname, firstname, gender, email, password });
    fs.writeFileSync(this._recordedUsersFilepath, JSON.stringify(users));
  }
}

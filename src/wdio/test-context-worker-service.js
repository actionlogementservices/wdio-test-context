/* global browser */

import path from 'node:path';
import fs from 'node:fs/promises';
import { inspect } from 'node:util';

import moment from 'moment';
import { SevereServiceError } from 'webdriverio';

import { logger } from '../logger.js';

/** @typedef {import('@wdio/types/build/Options.d.ts').Testrunner } TestrunnerOptions */
/** @typedef {import('@wdio/types/build/Capabilities.d.ts').TestrunnerCapabilities} TestrunnerCapabilities */
/** @typedef {import('@wdio/types/build/Frameworks.d.ts').Test} Test */
/** @typedef {import('@wdio/types/build/Frameworks.d.ts').TestResult} TestResult */
/** @typedef {import('../types.js').TestContextWorkerServiceOptions} TestContextWorkerServiceOptions */
/** @typedef {import('../types.js').LogLevel} LogLevel */

/** @type {(object: any) => any } */ const filterPrivateProperty = object =>
  Object.fromEntries(Object.entries(object).filter(([key]) => !key.startsWith('_') && key !== 'mailService'));

export default class TestContextWorkerService {
  /**
   * Imlements the **WDIO Worker Service** that handles the Test Context life cycle.
   * @param {TestContextWorkerServiceOptions} serviceOptions
   * @param {TestrunnerCapabilities} _capabilities
   * @param {TestrunnerOptions} _config
   */
  constructor(serviceOptions, _capabilities, _config) {
    const { testContext, logLevel } = serviceOptions;
    if (!testContext)
      throw new SevereServiceError(
        'No context specified in TestContextWorkerService options! This is a required parameter.'
      );
    this._logLevel = logLevel ?? 'error';
    logger.setLogLevel(this._logLevel);
    this._context = testContext;
    this._context.setLogLevel(this._logLevel);
  }

  /**
   * Gets executed just before initialising the webdriver session and test framework.
   * **Displays** the Test Context.
   * @param {TestrunnerOptions} _config
   * @param {TestrunnerCapabilities} _capabilities
   * @param {string[]} _specs
   * @param {string} _cid
   */
  beforeSession(_config, _capabilities, _specs, _cid) {
    logger.debug(
      inspect(filterPrivateProperty(this._context), {
        colors: true,
        depth: 5
      })
    );
  }

  /**
   * Gets executed after a test.
   * Generates **error screenshot** if applicable.
   * @param {Test} test
   * @param {*} _context
   * @param {TestResult} result
   */
  async afterTest(test, _context, result) {
    const { passed, error: testError } = result;
    if (passed || !testError || !this._context) return;
    const { dataset, environmentName } = this._context;
    try {
      const folder = path.join(process.cwd(), 'screenshot', environmentName, dataset);
      await fs.mkdir(folder, { recursive: true });
      const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
      const filename = path.join(folder, `error-${timestamp}`);
      const { message, stack } = testError;
      const errorLines = stack?.split('at ') ?? [];
      const errorFile = errorLines
        .find((/** @type {string} */ l) => l.toLowerCase().includes('e2e.js'))
        .trim();
      const fileContent = `Test : ${test.fullName}\nErreur : ${message}${
        errorFile ? '\nEmplacement : ' + errorFile : ''
      }`;
      await fs.writeFile(`${filename}.txt`, fileContent, { encoding: 'utf8', flag: 'w', flush: true });
      await browser.saveScreenshot(`${filename}.png`);
    } catch (error) {
      logger.detailError(error);
    }
  }
}

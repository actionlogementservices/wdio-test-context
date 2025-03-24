/**
 * Internal logger.
 * @module
 * @category internal
 */

/* eslint-disable no-console */
import chalk from 'chalk';

const noop = () => {};
/** console implementation @type {(message: string) => void} */
const logError = message => console.error(chalk.red(message));
/** console implementation @type {(message: string) => void} */
const logWarn = message => console.warn(chalk.yellow(message));
/** console implementation @type {(message: string) => void} */
const logInfo = message => console.info(chalk.bold.green(message));
/** console implementation @type {(message: string) => void} */
const logDebug = message => console.debug(chalk.blueBright.italic(message));
/** console implementation @type {(message: string) => void} */
const log = message => console.log(message);

/** @type {(message: string) => string} */
const bold = text => chalk.bold(text);

const level = {
  none: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4
};

class Logger {
  /** @type {Map<'error' | 'warn' | 'info' | 'debug' | 'log', (message: string) => void>} */ _logMethodFactory;
  /** @type {Number} */ _level;

  /**
   * Implements an internal Logger plugged on console.
   * @param {import('./types').LogLevel} logLevel logging level
   */
  constructor(logLevel) {
    this.setLogLevel(logLevel);
  }

  /**
   * Sets the logging level.
   * @param {import('./types').LogLevel} logLevel logging level
   */
  setLogLevel(logLevel) {
    this._level = level[logLevel] ?? level.none;
    this._logMethodFactory = new Map();
    this._logMethodFactory.set('error', this._level >= level.error ? logError : noop);
    this._logMethodFactory.set('warn', this._level >= level.warn ? logWarn : noop);
    this._logMethodFactory.set('info', this._level >= level.info ? logInfo : noop);
    this._logMethodFactory.set('debug', this._level >= level.debug ? logDebug : noop);
    this._logMethodFactory.set('log', this._level >= level.debug ? log : noop);
  }

  /**
   * Logs an **informational** message.
   * @param {string} message the message to log
   */
  info(message) {
    this._logMethodFactory.get('info')(message);
  }

  /**
   * Logs a message.
   * @param {string} message the message to log
   */
  log(message) {
    this._logMethodFactory.get('log')(message);
  }

  /**
   * Logs a **warning** message.
   * @param {string} message the message to log
   */
  warn(message) {
    this._logMethodFactory.get('warn')(message);
  }

  /**
   * Logs an **error** message.
   * @param {string} message the message to log
   */
  error(message) {
    this._logMethodFactory.get('error')(message);
  }

  /**
   * Logs a **debug** message
   * @param {string} message the message to log
   */
  debug(message) {
    this._logMethodFactory.get('debug')(message);
  }

  /**
   * Logs an **error** message based on the specified error object.
   * @param {Error} detailedError the error object to log
   */
  detailError(detailedError) {
    if (this._level === level.none) return;
    const { message, stack } = detailedError;
    console.error('Error: ' + chalk.red.bold(message));
    if (stack) console.error('Stack: ' + chalk.gray(stack));
  }

  /**
   * Logs an **warning** message based on the specified error object.
   * @param {string} text the text message to log
   * @param {{ message: string, errorType: string }} meaningfulErrorInfo the meaningfull error info to log
   */
  warnError(text, meaningfulErrorInfo) {
    if (this._level < level.warn) return;
    const { message, errorType } = meaningfulErrorInfo;
    logWarn(`${text}${bold(errorType)}: ${message}`);
  }
}

/**
 * The common logger instance.
 */
export const logger = new Logger('error');

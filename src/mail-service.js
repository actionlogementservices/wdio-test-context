/**
 * **Mail service** to send and retrieve mail from various provider.
 * Accessible through the **mailService property** of the TestContext instance.
 * @module
 * @category public
 */

import nodemailer from 'nodemailer';

import * as provider from './page-objects/index.js';
import { logger } from './logger.js';

/** @typedef {import('./types.js').MailProvider} MailProvider */

export class MailService {
  /** disposable email provider @type {MailProvider} */ provider;

  /**
   * Implements a service that sends and retrieves emails with a given provider.
   * @param {import('./types.js').MailProviderName} providerName disposable email provider name
   */
  constructor(providerName) {
    this.provider = provider[providerName].default;
  }

  /**
   * Provider name
   * @type {string}
   */
  get name() {
    return this.provider?.name;
  }

  /**
   * Emails domains exposed by the provider.
   * @type {string[]}
   */
  get domains() {
    return this.provider?.domains;
  }

  /**
   * Sends a mail.
   * @param {string} from sender
   * @param {string} to recipient
   * @param {string} subject subject of the mail
   * @param {string} html html body string of the mail
   * @returns {Promise<void>}
   */
  async sendMessage(from, to, subject, html) {
    const transporter = nodemailer.createTransport({ host: 'smtp.als.lan', secure: false, port: 25 });
    await transporter.sendMail({ from, to, subject, html });
  }

  /**
   * Waits for an email from the specified sender and containing the specified subject
   * and gets its content.
   * @param {string} email recipient email
   * @param {string} from sender
   * @param {string} subject subject of email
   * @returns {Promise<string>} content of email
   */
  async waitForMessage(email, from, subject) {
    logger.debug('1/3 - Opening mailbox...');
    await this.provider.openInbox(email);
    logger.debug('2/3 - Looking for mails...');
    const messages = await this.provider.getMessages();
    logger.debug(`    - ${messages.length} mails in inbox.`);
    const correspondingIndex = messages.findIndex(
      m =>
        m.from.toLowerCase().includes(from.toLowerCase()) &&
        m.subject.toLowerCase().includes(subject.toLowerCase())
    );
    if (correspondingIndex === -1) {
      logger.warn('    No corresponding mail found!');
      return;
    }
    logger.debug('3/3 - Mail found, extracting content...');
    return this.provider.getMessageContent(correspondingIndex);
  }
}

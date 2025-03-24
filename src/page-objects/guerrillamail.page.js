/**
 * Page-object on top of Guerilla Mail.
 * @module
 * @category internal
 */

/* global browser,$,$$ */

import Page from './page.js';
import { logger } from '../logger.js';

const mailFromGuerilla = 'no-reply@guerrillamail.com';

/**
 * Implements a page-object on top of Guerilla Mail.
 */
class GuerillamailPage extends Page {
  /** name of the provider */ name = 'Guerilla Mail';

  /** domains exposed of the provider */
  domains = [
    'sharklasers.com',
    'guerrillamail.info',
    'grr.la',
    'guerrillamail.biz',
    'guerrillamail.com',
    'guerrillamail.de',
    'guerrillamail.net',
    'guerrillamail.org',
    'guerrillamailblock.com',
    'pokemail.net',
    'spam4.me'
  ];

  css = {
    text: {
      inbox: '#content div.mailbox table tbody'
    },
    input: {
      nom: '#inbox-id input'
    },
    button: {
      nom: '#inbox-id',
      set: 'button.save',
      consent: 'div.fc-consent-root button[aria-label=Consent]'
    },
    options: {
      domaines: '#gm-host-select option'
    },
    tbody: {
      messages: '#email_list'
    },
    select: {
      domaine: '#gm-host-select'
    },
    div: {
      messages: '#email_list tr',
      content: 'div.email_body',
      popup: 'div.fc-consent-root'
    },
    td: {
      from: 'td:nth-of-type(2)',
      fromguerrilla: '#email_list tr:nth-of-type(1) td.td2',
      subject: 'td:nth-of-type(3)'
    }
  };

  /**
   * WDIO logic to open the mailbox.
   * @param {string} email disposable email
   */
  async openInbox(email) {
    await this.openNewTab('inbox', `https://www.guerrillamail.com/fr/inbox`);
    const popup = await this.verifyElementExistsDuring(this.css.div.popup, 5);
    if (popup) {
      await this.click(this.css.button.consent);
      logger.debug('Guerilla Mail popup detected');
    }
    const [alias, domain] = email.split('@');
    await this.click(this.css.button.nom);
    await this.fillInput(this.css.input.nom, alias);
    await this.click(this.css.button.set);
    await this.selectItem(this.css.select.domaine, domain);
  }

  /**
   * WDIO logic to retrieve domains exposed by the provider.
   * @returns {Promise<string[]>}
   */
  async retrieveDomains() {
    // le tableau contenant tous les domaines
    const domains = await this.getOptions(this.css.options.domaines);
    return domains;
  }

  /**
   * WDIO logic to get emails.
   * @return {Promise<{ from: string, subject: string}[]>}
   */
  async getMessages() {
    let noMessage = true;
    do {
      // on attend 1s avant de revérifier
      await browser.pause(1000);
      // on vérifie s'il y a des messages autre que celui de guerilla
      const from = await $(this.css.td.fromguerrilla).getText();
      noMessage = from === mailFromGuerilla;
    } while (noMessage);
    const froms = [];
    const messagesCount = await $$(this.css.div.messages).length;
    for (let index = 0; index < messagesCount; index++) {
      const from = await $(`tr:nth-of-type(${index + 1}) td:nth-of-type(2)`).getText();
      const subject = await $(`tr:nth-of-type(${index + 1}) td:nth-of-type(3)`).getText();
      froms.push({ from, subject });
    }
    // // étrangement, ne fonctionne pas avec les tableaux
    // const messages = await $$(this.css.div.messages).getElements();
    // for (const message of messages) {
    //   const from = await message.$(this.css.td.from).getText();
    //   const subject = await message.$(this.css.td.subject).getText();
    //   froms.push({ from, subject });
    // }
    return froms;
  }

  /**
   * WDIO logic to get the specified message content.
   * @param {number} index
   * @returns {Promise<string>}
   */
  async getMessageContent(index) {
    // on attend que la zone contenant les messages soit prête
    await $(this.css.div.messages).parentElement().waitForStable();
    const messages = await $$(this.css.div.messages);
    const message = messages[index];
    await message.click();
    const content = await $(this.css.div.content);
    return content.getHTML({ includeSelectorTag: false });
  }
}

const page = new GuerillamailPage();

export default page;

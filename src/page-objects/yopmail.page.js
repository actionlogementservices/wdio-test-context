/**
 * Page-object on top of YOPmail.
 * @module
 * @category internal
 */
/* global browser,$,$$ */

import Page from './page.js';
import { logger } from '../logger.js';

/**
 * Implements a page-object on top of YOPmail.
 */
class YopmailPage extends Page {
  /** name of the provider */ name = 'YOPmail!';

  /** domains exposed of the provider */ domains = ['yopmail.com'];

  css = {
    text: {
      inbox: '#content div.mailbox table tbody'
    },
    button: {
      refresh: '#refresh',
      accepterpopup: 'button[aria-label=Autoriser]'
    },
    div: {
      messages: 'div.m',
      from: 'div.lmfd span.lmf',
      subject: 'div.lms',
      content: '#mail',
      popup: 'div.fc-consent-root'
    },
    iframe: {
      inbox: 'iframe[name=ifinbox]',
      message: 'iframe[name=ifmail]'
    }
  };

  /**
   * WDIO logic to open the mailbox.
   * @param {string} email disposable email
   */
  async openInbox(email) {
    await this.openNewTab('inbox', `https://yopmail.com?${email}`);
    const popup = await this.verifyElementExistsDuring(this.css.div.popup, 2);
    if (popup) {
      await this.click(this.css.button.accepterpopup);
      logger.debug('Yopmail popup detected');
    }
  }

  /**
   * WDIO logic to get emails.
   * @return {Promise<{ from: string, subject: string}[]>}
   */
  async getMessages() {
    let noMessage = true;
    // on attent que l'iframe inbox soit présent
    do {
      // on attend 1,5s avant de cliquer sur refresh
      await browser.pause(1500);
      // on bascule sur la fenêtre principale car le bouton refresh est dedans
      await this.switchToFrame();
      await this.click(this.css.button.refresh);
      await browser.pause(500);
      // on retourne sur l'iframe inbox pour contrôler les messages
      await this.switchToFrame(this.css.iframe.inbox);
      // on regarde s'il y a au moins un message (= un div.m)
      noMessage = !(await this.verifyElementExists(this.css.div.messages));
    } while (noMessage);
    // on récupère la liste de tous les messages
    const messages = await $$(this.css.div.messages).getElements();
    const froms = [];
    for (const message of messages) {
      const from = await message.$(this.css.div.from).getText();
      const subject = await message.$(this.css.div.subject).getText();
      froms.push({ from, subject });
    }
    return froms;
  }

  /**
   * WDIO logic to get the specified message content.
   * @param {number} index
   * @returns {Promise<string>}
   */
  async getMessageContent(index) {
    // on clique sur le message correspondant à l'index demandé
    const messages = await $$(this.css.div.messages);
    await messages[index].click();
    // on bascule sur la fenêtre principale car l'iframe message est dedans
    await this.switchToFrame();
    // on bascule sur l'iframe message pour lire le contenu du message
    await this.switchToFrame(this.css.iframe.message);
    return this.getHtml(this.css.div.content);
  }
}

const page = new YopmailPage();

export default page;

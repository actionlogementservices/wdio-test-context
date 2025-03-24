/**
 * Page-object on top of maildrop.
 * @module
 * @category internal
 */

/* global browser,$,$$ */

import Page from './page.js';

/**
 * Implements a page-object on top of maildrop.
 */
class MaildropPage extends Page {
  /** name of the provider */ name = 'maildrop';

  /** domains exposed of the provider */ domains = ['maildrop.cc'];

  css = {
    text: {
      inbox: '#content div.mailbox table tbody'
    },
    div: {
      messageZone: 'main div.subhead',
      messages: 'main div.message',
      from: 'div:nth-of-type(1)',
      subject: 'div:nth-of-type(3)',
      content: 'html body'
    },
    input: {
      name: 'main + section form input[placeholder=view-this-mailbox]'
    },
    button: {
      view: 'main + section form button',
      refresh: 'main button'
    },
    iframe: {
      messages: 'iframe[srcdoc]'
    }
  };

  /**
   * WDIO logic to open the mailbox.
   * @param {string} email disposable email
   */
  async openInbox(email) {
    await this.openNewTab('inbox', `https://maildrop.cc`);
    const alias = email.split('@')[0];
    // on clique dans le champ sinon le site change son contenu quand on clique sur le bouton View
    await this.click(this.css.input.name);
    await browser.pause(400);
    await this.fillInput(this.css.input.name, alias);
    await browser.pause(300);
    await this.click(this.css.button.view);
    await $(this.css.button.refresh).waitForExist();
  }

  /**
   * WDIO logic to get emails.
   * @return {Promise<{ from: string, subject: string}[]>}
   */
  async getMessages() {
    let noMessage = true;
    do {
      // on attend 1,5s avant de cliquer sur refresh
      await this.click(this.css.button.refresh);
      // on attend que la zone contenant les messages soit prête
      await $(this.css.div.messageZone).waitForDisplayed();
      // on vérifie s'il y a des messages
      noMessage = !(await this.verifyElementExists(this.css.div.messages));
      if (noMessage) await browser.pause(1500);
    } while (noMessage);
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
    await this.click(`${this.css.div.messages}:nth-of-type(${index + 1})`);
    await this.switchToFrame(this.css.iframe.messages);
    return this.getHtml(this.css.div.content);
  }
}

const page = new MaildropPage();

export default page;

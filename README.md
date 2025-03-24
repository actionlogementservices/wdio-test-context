# wdio-test-context
A framework to add test context to webdriverio end to end tests.
- It uses JSON files (named dataset) and optional javascript function to add dynamic content to your dataset.
- It consumes a disposable mail service (YOPmail, maildrop or Guerilla Mail) in order to check for new message.
- It provides pdf generation to enable document uploads.
- It provides an Azure DevOps webdriverio reporter.
- It generates a screenshot when the test fails.

## Installation 

- In your webdriverio test project:

  ```sh
  npm install @actionlogementservices/wdio-test-context
  ```

- Create a `data` folder

- Create JSON files in the `data` folder: this will be your datasets.

- Create a `data/test-context.d.ts`: this will add intellisense when you use your test context data within the spec files.

- Create a `data/test-context.js` file with the following code:

  ```js
  // import your own function to generate dynamic data
  import { generateRandomData } from './generate-random-data.js'; 
  import { TestContext } from '@actionlogementservices/wdio-test-context';

  // to enable intellisense with your own data
  /** @typedef {import('./test-context.d.ts').TestContextModel} TestContextModel */

  /** @type {TestContextModel & TestContext} */
  export const testContext = /** @type {TestContextModel & TestContext} */ (
    new TestContext()
      .setDataGenerator(generateRandomData) // optional : add your own dynamic data
      .setDefaultDataset('test') // default dataset name when DATASET env var is not specified
      .setEnvironment('local', {
        frontUrl: 'https://test.lvh.me',
        backOfficeUrl: 'https://test-backoffice.lvh.me:4432',
        sso: true,
      })
      .setEnvironment('staging', {
        frontUrl: 'https://staging.domain.com',
        backOfficeUrl: 'https://staging-backoffice.domain.com',
      })
      .initialize()
  );  
  ```

- Create optionnally `data/generate-random-data.js` to add dynamic data, file with the following code:

  ```js
  import { faker } from '@faker-js/faker/locale/fr';
  import moment from 'moment';

  /** @typedef {import('@actionlogementservices/wdio-test-context/types').DataGenerator} DataGenerator */

  /** @type {DataGenerator} */
  function generateRandomData(_context) {
    // dates random
    const customDate = faker.date.between({ from: '1995-01-01', to: '2001-01-01' });
    return {
      customDate,
    };
  }

  export { generateRandomData };
  ```

- Configure webdriverio: in your wdio.conf.js:

    ```js
  import { AdoReporter, TestContextWorkerService } from '@actionlogementservices/wdio-test-context';
  import { testContext } from './data/test-context.js';

  export const config = {
    ...
    reporters: [[AdoReporter, {}]],
    services: [[TestContextWorkerService, { testContext, logLevel: 'debug' }]],
    ...
  ```

## Use the test context in the spec file

- Somewhere in your spec files: 

  ```js
  import { testContext } from '../../environments.js';

  describe(`[Inbox] - ${testContext.user.email} - I`, () => {
  let confirmationLink;
  it('receive a mail with confirmation code within 10s', async () => {
    await browser.open(testContext.getParameter('frontUrl')); // to retrieve parameters
    const from = 'no-reply@domain.com';
    const subject = `Confirmation code`;
    // to wait for email and to access test context data
    const content = await testContext.mailService.waitForMessage(testContext.user.email, from, subject);
    confirmationCode = getConfirmationCode(content);
    expect(confirmationCode).toContain('123456');
  });
  ```

## Run your test

- Specify the dataset with the `DATASET` env var and the environment with the `TARGET_ENV` env var

  ```sh
  TARGET_ENV=staging DATASET=full-scenario npx wdio
  or
  TARGET_ENV=staging DATASET=full-scenario npm test
  ```

## Code documentation

- Code is [documented here](./doc/toc.md).

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
        //define parameters for your environment
        frontUrl: 'https://test.lvh.me',
        backOfficeUrl: 'https://test-backoffice.lvh.me:4432',
        sso: true
      })
      .setEnvironment('staging', {
        frontUrl: 'https://staging.domain.com',
        backOfficeUrl: 'https://staging-backoffice.domain.com'
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
      customDate
    };
  }

  export { generateRandomData };
  ```

- Configure optionnaly a **RabbitMQ client** if you plan to send some RabbitMQ message within your tests:

  > **NOTE**
  >
  > - If you have secrets in your connection string, you need to
  >
  >   - create a `.env.{your_environment_name}.local` file (for instance `.env.staging.local`) with your secret configuration parameters.
  >   - add the following entries to your `.gitignore`:
  >
  >     `.env.local`<br>`.env.*.local`

  ```js
  export const testContext = /** @type {TestContextModel & TestContext} */ (
    new TestContext()
      .setEnvironment(
        'local',
        {
          frontUrl: 'https://test.lvh.me',
        },
        {
          amqp: String.raw`amqps://${process.env.RMQ_USER}:${process.env.RMQ_PWD}@your-host:5671/your-vhost`,
        }
      )
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
  }
  ```

## Notes on secrets

If you have **secrets** in your parameter values, you need to

- create a `.env.{your_environment_name}.local` file (for instance `.env.staging.local`) with your secret configuration parameters:

  ```sh
  DB_PWD="MySyperStrongPassword"
  CLIENT_SECRET="MySuperSafeSecret"
  ```

- references the secret in the environment.js like this:

  ```js
  .setEnvironment('staging', {
    sql: 'Server=YourServer;Password=${process.env.DB_PWD};...'
  ```

- to add the following entries to your `.gitignore` to prevent storing secret values in your repository:

  ```sh
  .env.local
  .env.*.local
  ```

## Use the test context in the spec file

### To access the mail service

- Access the `mailService` property:

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
  }
  ```

### To execute SQL queries

- You need to define a **parameter** in `your environment.js` that contains the **sql connection string**. In the following exemple it is named `sqlBO`.

  ```js
  export const testContext = /** @type {TestContextModel & TestContext} */ (
    new TestContext()
      .setEnvironment(
        'local',
        {
          frontUrl: 'https://test.lvh.me',
          sqlBO: String.raw`Driver={ODBC Driver 17 for SQL Server};Server=(localdb)\MSSQLLocalDB;Database=YourDatabase;Trusted_Connection=yes;`,
        }
      )
  ```

  > **NOTES on SQL connection string**
  >
  > - If you plan to use `(localdb)` or **Windows authentication** this requires an **ODBC driver** with a specific connection string syntax : `Driver={...}`. You also need to check which Microsoft SQL Server **ODBC driver** is installed on your system with the `ODBC Data Sources` control panel.
  > - For Microsoft Sql Server instance without Windows Authentication, there is no need to use an ODBC driver. In such case remove the `Driver={...}` portion of the connection string.
  > - You **can not** mix both syntax in the same environment.
  > - In the previous example, `(localdb)` is used with the `ODBC Driver 17 for SQL Server` which is installed.

- Somewhere in you spec files

  ```js
  import { testContext } from '../../environments.js';

  describe(`Before starting the test, we`, () => {

  it('check the sql version', async () => {
    const result = await testContext.executeSql('sqlBO', (sql) => sql.query('SELECT @@Version'));
    ...
  });
  ```

### To publish AMQP message

- You need to define a **parameter** in `your environment.js` that contains the **amqp connection string**. In the following exemple it is named `amqpBO`.

  ```js
  export const testContext = /** @type {TestContextModel & TestContext} */ (
    new TestContext()
      .setEnvironment(
        'local',
        {
          frontUrl: 'https://test.lvh.me',
          amqpBO: String.raw`Driver={ODBC Driver 17 for SQL Server};Server=(localdb)\MSSQLLocalDB;Database=YourDatabase;Trusted_Connection=yes;`,
        }
      )
  ```

- Somewhere in you spec files

  ```js
  import { testContext } from '../../environments.js';

  describe(`Before starting the test, we`, () => {

  it('send an amqp message', async () => {
    const result = await testContext.publishMessage('amqpBO',
      'exchange',             // your exchange name
      'routingKey',           // your routing key
      'type',                 // your message type
      { test: true },         // your message payload
      testContext.user.email  // something to correlate/track you message
    );
    expect(result).toBe(true);
  });
  ```

### To run a VTOM job

- You need to define a **parameter** in `your environment.js` that contains the **VTOM configuration**. In the following exemple it is named `vtomBO`.

  ```js
  export const testContext = /** @type {TestContextModel & TestContext} */ (
    new TestContext()
      .setEnvironment(
        'local',
        {
          frontUrl: 'https://test.lvh.me',
          vtomBO: {
            url: 'https://...',
            apiKey: 'abcdef',
            environement: 'DEV'
          },
        }
      )
  ```

- Somewhere in you spec files

  ```js
  import { testContext } from '../../environments.js';

  describe(`Before starting the test, we`, () => {

  it('run a vtom job', async () => {
    const result = await testContext.runVtomJob('vtomBO', 'app', 'job');
    expect(result).toBe(true);
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

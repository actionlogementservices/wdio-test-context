# wdio-test-context

[![npm package](https://img.shields.io/npm/v/%40actionlogementservices%2Fwdio-test-context)](https://www.npmjs.com/package/@actionlogementservices/wdio-test-context)

A framework to add test context to webdriverio end to end tests.

- It uses JSON files (named datasets) and an optional javascript function to add dynamic content to your dataset.
- It generates a random test user (name, gender, disposable email address) for each run.
- It consumes a disposable mail service (maildrop, YOPmail or Guerrilla Mail) in order to check for new messages.
- It executes SQL queries on Microsoft SQL Server, publishes AMQP (RabbitMQ) messages and runs VTOM jobs.
- It provides pdf generation to enable document uploads.
- It provides an Azure DevOps webdriverio reporter.
- It generates a screenshot when a test fails.

## Prerequisites

- Node.js 22 or later.
- webdriverio 9 (`@wdio/globals` is a peer dependency).

## Installation

- In your webdriverio test project:

  ```sh
  npm install @actionlogementservices/wdio-test-context
  ```

- Create a `data` folder.

- Create JSON files in the `data` folder: these are your datasets. The content of the selected dataset is merged into the test context. For instance `data/test.json`:

  ```json
  {
    "company": { "name": "ACME" }
  }
  ```

- Create a `data/test-context.d.ts` file: it adds intellisense when you use your test context data within the spec files.

  ```ts
  export type TestContextModel = {
    company: { name: string };
    customDate: Date;
  };
  ```

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
      .setDataGenerator(generateRandomData) // add your own dynamic data
      .setDefaultDataset('test') // default dataset name when the DATASET env var is not specified
      .setMailProvider('maildrop') // optional: 'maildrop' (default), 'yopmail' or 'guerrillamail'
      .setSmtpServer({ host: 'smtp.domain.com', port: 25 }) // optional: only to send emails with mailService.sendMessage
      .setEnvironment('local', {
        // define the parameters of your environment
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

  > **NOTES**
  >
  > - The first environment is the default one when the `TARGET_ENV` env var is not specified.
  > - `setEnvironment` accepts a third `options` argument. With `{ perEnvironmentData: true }`, the datasets of this environment are read from `data/{environment_name}/` instead of `data/`.
  > - The mail provider can be overridden with the `MAILPROVIDER` env var.

- Create `data/generate-random-data.js` to add dynamic data, with the following code:

  ```js
  import { faker } from '@faker-js/faker/locale/fr';

  /** @typedef {import('@actionlogementservices/wdio-test-context/types').DataGenerator} DataGenerator */

  /** @type {DataGenerator} */
  function generateRandomData(_context) {
    // random date
    const customDate = faker.date.between({ from: '1995-01-01', to: '2001-01-01' });
    return {
      customDate
    };
  }

  export { generateRandomData };
  ```

- Configure webdriverio in your `wdio.conf.js`:

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

  The `logLevel` option accepts `none`, `error` (default), `warn`, `info` or `debug`.

## Environment variables

| Name                                                                        | Description                                                                                           |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `USER_PASSWORD`                                                             | **Required.** Password given to the generated test user (`testContext.user.password`).                |
| `TARGET_ENV`                                                                | Name of the environment to use. Defaults to the first environment set.                                |
| `DATASET`                                                                   | Name of the dataset (JSON file name without extension). Defaults to `setDefaultDataset` value.        |
| `MAILPROVIDER`                                                              | Overrides the disposable mail provider (`maildrop`, `yopmail` or `guerrillamail`).                    |
| `EMAIL`                                                                     | Reuses a previously recorded user (see [Test user](#test-user)) instead of generating a new one.      |
| `DEBUG`                                                                     | When set, raises the `BasePage` default wait timeout from 20 s to 1 hour, for step by step debugging. |
| `SYSTEM_ACCESSTOKEN` or `TOKEN`                                             | Azure DevOps reporter: pipeline access token, or personal access token when `TOKEN` is used.          |
| `SYSTEM_TEAMFOUNDATIONCOLLECTIONURI`, `SYSTEM_TEAMPROJECT`, `BUILD_BUILDID` | Azure DevOps reporter: set automatically by Azure Pipelines.                                          |

## Notes on secrets

Environment variables are loaded with [dotenv-flow](https://www.npmjs.com/package/dotenv-flow), the environment name (`TARGET_ENV`) being the dotenv-flow `node_env`: `.env`, `.env.local`, `.env.{environment_name}` and `.env.{environment_name}.local` files are read.

If you have **secrets** in your parameter values, you need to:

- create a `.env.{environment_name}.local` file (for instance `.env.staging.local`) with your secret configuration parameters:

  ```sh
  USER_PASSWORD="MySuperStrongPassword"
  DB_PWD="MySuperStrongPassword"
  RMQ_USER="MyUser"
  RMQ_PWD="MySuperSafeSecret"
  ```

- reference the secret in `data/test-context.js` with a **template literal** (backticks, not quotes):

  ```js
  .setEnvironment('staging', {
    sqlBO: `Server=YourServer;Database=YourDatabase;User Id=YourUser;Password=${process.env.DB_PWD};`
  })
  ```

- add the following entries to your `.gitignore` to prevent storing secret values in your repository:

  ```sh
  .env.local
  .env.*.local
  # recorded test users, including their password
  data/log/
  # error screenshots
  screenshot/
  ```

## Use the test context in the spec file

### Test user

- A random user is generated at each run and is available in `testContext.user` (`gender`, `firstname`, `lastname`, `email` on a domain of the mail provider, `password` from the `USER_PASSWORD` env var).
- Call `testContext.recordTestUser()` (for instance once the user account is created) to append the user to `data/log/users.json`. As it contains the passwords, a `.gitignore` is created in `data/log/` so that the folder is never committed.
- Run the tests with `EMAIL=<recorded email>` to reuse a recorded user of the current environment, or `EMAIL=last` to reuse the last recorded one.

### To access the mail service

- Use the `mailService` property:

  ```js
  import { testContext } from '../data/test-context.js';

  describe(`[Inbox] - ${testContext.user.email}`, () => {
    it('receives a mail with a confirmation code', async () => {
      await browser.url(testContext.getParameter('frontUrl')); // to retrieve parameters
      ...
      const from = 'no-reply@domain.com';
      const subject = 'Confirmation code';
      // to wait for the email and to access the test context data
      const content = await testContext.mailService.waitForMessage(testContext.user.email, from, subject);
      const confirmationCode = getConfirmationCode(content); // your own function
      expect(confirmationCode).toContain('123456');
    });
  });
  ```

- To send an email, define the smtp server with `setSmtpServer({ host, port, secure })` in `data/test-context.js`, then call `await testContext.mailService.sendMessage(from, to, subject, html)`.

### To execute SQL queries

- You need to define a **parameter** in `data/test-context.js` that contains the **sql connection string**. In the following example it is named `sqlBO`.

  ```js
  export const testContext = /** @type {TestContextModel & TestContext} */ (
    new TestContext()
      .setEnvironment('local', {
        frontUrl: 'https://test.lvh.me',
        sqlBO: String.raw`Driver={ODBC Driver 17 for SQL Server};Server=(localdb)\MSSQLLocalDB;Database=YourDatabase;Trusted_Connection=yes;`
      })
      .initialize()
  );
  ```

  > **NOTES on SQL connection string**
  >
  > - If you plan to use `(localdb)` or **Windows authentication**, this requires an **ODBC driver** with a specific connection string syntax: `Driver={...}`. You also need to check which Microsoft SQL Server **ODBC driver** is installed on your system with the `ODBC Data Sources` control panel.
  > - For a Microsoft SQL Server instance without Windows authentication, there is no need to use an ODBC driver. In such case remove the `Driver={...}` portion of the connection string.
  > - You **cannot** mix both syntaxes in the same environment.
  > - In the previous example, `(localdb)` is used with the `ODBC Driver 17 for SQL Server`, which is installed.

- Somewhere in your spec files:

  ```js
  import { testContext } from '../data/test-context.js';

  describe('Before starting the test, we', () => {
    it('check the sql version', async () => {
      const result = await testContext.executeSql('sqlBO', sql => sql.query('SELECT @@Version'));
      ...
    });
  });
  ```

### To publish AMQP messages

- You need to define a **parameter** in `data/test-context.js` that contains the **amqp connection string**. In the following example it is named `amqpBO`.

  ```js
  export const testContext = /** @type {TestContextModel & TestContext} */ (
    new TestContext()
      .setEnvironment('local', {
        frontUrl: 'https://test.lvh.me',
        amqpBO: `amqps://${process.env.RMQ_USER}:${process.env.RMQ_PWD}@your-host:5671/your-vhost`
      })
      .initialize()
  );
  ```

- Somewhere in your spec files:

  ```js
  import { testContext } from '../data/test-context.js';

  describe('Before starting the test, we', () => {
    it('send an amqp message', async () => {
      const result = await testContext.publishMessage(
        'amqpBO',
        'exchange', // your exchange name
        'routingKey', // your routing key
        'type', // your message type
        { test: true }, // your message payload
        testContext.user.email // correlation id to track your message
      );
      expect(result).toBe(true);
    });
  });
  ```

### To run a VTOM job

- You need to define a **parameter** in `data/test-context.js` that contains the **VTOM configuration**. In the following example it is named `vtomBO`.

  ```js
  export const testContext = /** @type {TestContextModel & TestContext} */ (
    new TestContext()
      .setEnvironment('local', {
        frontUrl: 'https://test.lvh.me',
        vtomBO: {
          url: 'https://...',
          apiKey: process.env.VTOM_API_KEY,
          environment: 'DEV'
        }
      })
      .initialize()
  );
  ```

- Somewhere in your spec files (the job is stopped, started, then its status is checked every 5 s for 100 s at most):

  ```js
  import { testContext } from '../data/test-context.js';

  describe('Before starting the test, we', () => {
    it('run a vtom job', async () => {
      const result = await testContext.runVtomJob('vtomBO', 'app', 'job');
      expect(result).toBe(true);
    });
  });
  ```

### Other helpers

- `BasePage`: base class for your page objects (tab management, wait helpers…).
- `pdfGenerator`: `generatePdf(filename, testContext)` creates a pdf file to upload and returns its path, `deletePdf(filepath)` deletes it.

## Corporate CA certificates

If your environments use certificates issued by a private certificate authority, put the CA certificates (`*.crt` files) in a `ca` folder at the root of your test project: they are trusted when the test context is initialized.

## Run your tests

- Specify the dataset with the `DATASET` env var and the environment with the `TARGET_ENV` env var:

  ```sh
  TARGET_ENV=staging DATASET=full-scenario npx wdio
  # or
  TARGET_ENV=staging DATASET=full-scenario npm test
  ```

- When a test fails, a screenshot and a text file with the error are saved in `screenshot/{environment_name}/{dataset}/`.

- With the `AdoReporter`, the results are published as an Azure DevOps test run at the end of the run. In an Azure Pipelines job, map the access token to the script: `env: { SYSTEM_ACCESSTOKEN: $(System.AccessToken) }`.

## Code documentation

- Code is [documented here](./doc/toc.md) (generated with `npm run doc`).

## Release

The package is published on npm by the `Release` GitHub workflow, with npm trusted publishing (no npm token is stored in GitHub):

1. In your pull request, bump the version with `npm run bump -- <major|minor|patch|prerelease>` (updates `package.json` and `package-lock.json` only).
1. When the pull request is merged on `main`, the workflow runs the linter and **stages** the new version on npm.
   Prerelease versions (e.g. `2.1.0-0`) are staged with the `next` dist-tag.
1. The workflow creates a draft GitHub release and an issue assigned to the person who merged, as a reminder to:
   - approve the staged version in the **Staged Packages** tab of the [npm package](https://www.npmjs.com/package/@actionlogementservices/wdio-test-context) (2FA required),
   - publish the draft GitHub release, which creates the git tag,
   - close the issue.

If the staged version is rejected, delete the draft release and close the issue.

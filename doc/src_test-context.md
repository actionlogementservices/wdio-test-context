# Module `test-context`

![category:public](https://img.shields.io/badge/category-public-FF5000.svg?style=flat-square)

**Test Context** to be populated and passed to WDIO specs.

[Source file](../src/test-context.js)

## Constants

### `defaultMailProviderName`

![modifier: public](images/badges/modifier-public.png)



#### Value

```javascript
'maildrop'
```

---

# Class `TestContext`

Implements **Test Context** with data to pass to WDIO specs.

## Methods

### `setEnvironment(name, parameters, environmentOptions) ► TestContext`

![modifier: public](images/badges/modifier-public.png)

Implements a test context with environments and dataset in webdriverio.

Parameters | Type | Description
--- | --- | ---
__name__ | `string` | *name of the environment (defined by TARGET_ENV environment variable)*
__parameters__ | `Record.<string, any>` | *custom parameters (like &#x27;url&#x27;)*
__environmentOptions__ | `import('./types.d.ts').EnvironmentOptions` | *custom options (like sql or rabbitMQ clients)*
__*return*__ | [TestContext](src_test-context.md) | **

---

### `setDataGenerator(dataGenerator) ► TestContext`

![modifier: public](images/badges/modifier-public.png)

Defines a custom function that adds data to the current dataset

Parameters | Type | Description
--- | --- | ---
__dataGenerator__ | `DataGenerator` | **
__*return*__ | [TestContext](src_test-context.md) | **

---

### `setDefaultDataset(name) ► TestContext`

![modifier: public](images/badges/modifier-public.png)

Defines the **default dataset** when no DATASET environment variable is specified.

Parameters | Type | Description
--- | --- | ---
__name__ | `string` | *name ot the default dataset*
__*return*__ | [TestContext](src_test-context.md) | **

---

### `setMailProvider(name) ► TestContext`

![modifier: public](images/badges/modifier-public.png)

Defines the **disposable email provider**. Overriden by MAILPROVIDER environment variable. **maildrop** is default value.

Parameters | Type | Description
--- | --- | ---
__name__ | `MailProviderName` | *name of the disposable mail service provider*
__*return*__ | [TestContext](src_test-context.md) | **

---

### `setLogLevel(level)`

![modifier: public](images/badges/modifier-public.png)

Sets the logging level.

Parameters | Type | Description
--- | --- | ---
__level__ | `LogLevel` | *logging level*

---

### `initialize() ► TestContext`

![modifier: public](images/badges/modifier-public.png)

Initializes the data of the test context.

Parameters | Type | Description
--- | --- | ---
__*return*__ | [TestContext](src_test-context.md) | **

---

### `getParameter(name, mandatory) ► any`

![modifier: public](images/badges/modifier-public.png)

Retrieves the specified parameter of the current environment.

Parameters | Type | Description
--- | --- | ---
__name__ | `string` | **
__mandatory__ | `boolean` | **
__*return*__ | `any` | **

---

### `recordTestUser()`

![modifier: public](images/badges/modifier-public.png)

Records the current created user.

---

### `publishMessage(parameterName, exchange, routingKey, type, payload, correlationId) ► Promise.<boolean>`

![modifier: public](images/badges/modifier-public.png)

Published the amqp message to the specified exchange.

Parameters | Type | Description
--- | --- | ---
__parameterName__ | `string` | *name of the environment parameter that defines the amqp connection string*
__exchange__ | `string` | *name of the exchange*
__routingKey__ | `string` | *routing key*
__type__ | `string` | *type of the message*
__payload__ | `T` | *message payload*
__correlationId__ | `string` | *correlation id for message tracking*
__*return*__ | `Promise.<boolean>` | **

---

### `executeSql(parameterName, sqlOperation) ► Promise.<T>`

![modifier: public](images/badges/modifier-public.png)

Executes the specified sql operation.

Parameters | Type | Description
--- | --- | ---
__parameterName__ | `string` | *name of the environment parameter that defines the sql connection string*
__sqlOperation__ | `(sql: import('mssql').Request) => T` | *function using the sql request object*
__*return*__ | `Promise.<T>` | *sql query result*

---

### `runVtomJob(parameterName, appName, jobName) ► Promise.<boolean>`

![modifier: public](images/badges/modifier-public.png)

Runs the specified vtom job.

Parameters | Type | Description
--- | --- | ---
__parameterName__ | `string` | *name of the environment parameter that defines the vtom configuration*
__appName__ | `string` | *vtom application name*
__jobName__ | `string` | *vtom job name*
__*return*__ | `Promise.<boolean>` | *true if successful execution*

---

### `_generateRandomUser(mailService) ► TestUser`

![modifier: private](images/badges/modifier-private.png)

Generates a random user.

Parameters | Type | Description
--- | --- | ---
__mailService__ | [MailService](src_mail-service.md) | **
__*return*__ | `TestUser` | **

---

### `_getPreviouslyRecordedUser(email) ► TestUser`

![modifier: private](images/badges/modifier-private.png)

Retrieves the previously recorded user.

Parameters | Type | Description
--- | --- | ---
__email__ | `string` | **
__*return*__ | `TestUser` | **

---

## Members

Name | Type | Description
--- | --- | ---
__user__ | `TestUser` | *Test user @type {TestUser}*
__mailService__ | [MailService](src_mail-service.md) | *Mail service @type {MailService}*
__defaultEnvironmentName__ | `undefined` | *Retrieves the default (i.e. the first) environment name.*
__environmentName__ | `undefined` | *Retrieves the name of the current environment.*
__environment__ | `undefined` | *Retrieves the configuration of the current environment.*
__dataset__ | `undefined` | *The current dataset.*
__isDefaultDataset__ | `undefined` | *Is the current dataset the default one.*
___environments__ | `Map<string, TestEnvironmentConfiguration>` | *Test environments @private @type {Map&lt;string, TestEnvironmentConfiguration&gt;}*
___mailProviderName__ | `MailProviderName` | *Mail provider name @private @type {MailProviderName}*
___dataFolder__ | `string` | *data folder @private @type {string}*
___logFolder__ | `string` | *log folder @private @type {string}*
___recordedUsersFilepath__ | `string` | *data folder @private @type {string}*
___dataGenerator__ | `DataGenerator` | *custom data generator @private @type {DataGenerator}*
___defaultDatasetName__ | `string` | *default dataset name @private @type {string}*

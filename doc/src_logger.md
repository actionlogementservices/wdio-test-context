# Module `logger`

![category:internal](https://img.shields.io/badge/category-internal-009663.svg?style=flat-square)

Internal logger.

[Source file](../src/logger.js)

## Functions

### `logError()`

![modifier: public](images/badges/modifier-public.png)

console implementation @type {(message: string) &#x3D;&gt; void}

---

### `logWarn()`

![modifier: public](images/badges/modifier-public.png)

console implementation @type {(message: string) &#x3D;&gt; void}

---

### `logInfo()`

![modifier: public](images/badges/modifier-public.png)

console implementation @type {(message: string) &#x3D;&gt; void}

---

### `logDebug()`

![modifier: public](images/badges/modifier-public.png)

console implementation @type {(message: string) &#x3D;&gt; void}

---

### `log()`

![modifier: public](images/badges/modifier-public.png)

console implementation @type {(message: string) &#x3D;&gt; void}

---

### `bold()`

![modifier: public](images/badges/modifier-public.png)



---

## Constants

### `logger`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

The common logger instance.

#### Value

```javascript
new Logger('error')
```

---

# Class `Logger`



## Methods

### `setLogLevel(logLevel)`

![modifier: public](images/badges/modifier-public.png)

Sets the logging level.

Parameters | Type | Description
--- | --- | ---
__logLevel__ | `import('./types').LogLevel` | *logging level*

---

### `info(message)`

![modifier: public](images/badges/modifier-public.png)

Logs an **informational** message.

Parameters | Type | Description
--- | --- | ---
__message__ | `string` | *the message to log*

---

### `log(message)`

![modifier: public](images/badges/modifier-public.png)

Logs a message.

Parameters | Type | Description
--- | --- | ---
__message__ | `string` | *the message to log*

---

### `warn(message)`

![modifier: public](images/badges/modifier-public.png)

Logs a **warning** message.

Parameters | Type | Description
--- | --- | ---
__message__ | `string` | *the message to log*

---

### `error(message)`

![modifier: public](images/badges/modifier-public.png)

Logs an **error** message.

Parameters | Type | Description
--- | --- | ---
__message__ | `string` | *the message to log*

---

### `debug(message)`

![modifier: public](images/badges/modifier-public.png)

Logs a **debug** message

Parameters | Type | Description
--- | --- | ---
__message__ | `string` | *the message to log*

---

### `detailError(detailedError)`

![modifier: public](images/badges/modifier-public.png)

Logs an **error** message based on the specified error object.

Parameters | Type | Description
--- | --- | ---
__detailedError__ | `Error` | *the error object to log*

---

### `warnError(text, meaningfulErrorInfo)`

![modifier: public](images/badges/modifier-public.png)

Logs an **warning** message based on the specified error object.

Parameters | Type | Description
--- | --- | ---
__text__ | `string` | *the text message to log*
__meaningfulErrorInfo__ | `Object` | *the meaningfull error info to log*

---

## Members

Name | Type | Description
--- | --- | ---
___logMethodFactory__ | `Map<'error' \| 'warn' \| 'info' \| 'debug' \| 'log', (message: string) => void>` | **
___level__ | `Number` | **

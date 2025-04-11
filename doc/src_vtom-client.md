# Module `vtom-client`

![category:private](https://img.shields.io/badge/category-private-blue.svg?style=flat-square)

**Vtom client** to run Vtom job.
Accessible through the **runVtomJob** method of the TestContext instance.

[Source file](../src/vtom-client.js)

## Functions

### `wait(ms)`

![modifier: public](images/badges/modifier-public.png)



Parameters | Type | Description
--- | --- | ---
__ms__ | `number` | *number of milliseconds to wait*

---

### `createClient(baseURL, apiKey) ► import('axios').AxiosInstance`

![modifier: public](images/badges/modifier-public.png)

Creates the http client.

Parameters | Type | Description
--- | --- | ---
__baseURL__ | `string` | *api base url*
__apiKey__ | `string` | *vtom api key*
__*return*__ | `import('axios').AxiosInstance` | *}*

---

### `runVtomJob(apiUrl, apiKey, environment, appName, jobName) ► Promise.<boolean>`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Runs the specified vtom job.

Parameters | Type | Description
--- | --- | ---
__apiUrl__ | `string` | *vtom base api url*
__apiKey__ | `string` | *vtom api key*
__environment__ | `string` | *vtom environment*
__appName__ | `string` | *vtom application name*
__jobName__ | `string` | *vtom job name*
__*return*__ | `Promise.<boolean>` | **

---

# Module `ado-client`

![category:internal](https://img.shields.io/badge/category-internal-009663.svg?style=flat-square)

Azure DevOps rest client to push test results.

[Source file](../src/ado-client.js)

## Functions

### `isNullOrEmpty()`

![modifier: public](images/badges/modifier-public.png)



---

### `getConnectionInfo() ► ConnectionInfo`

![modifier: public](images/badges/modifier-public.png)

Retrieves Azure DevOps connection information.

Parameters | Type | Description
--- | --- | ---
__*return*__ | `ConnectionInfo` | **

---

### `getApis(connectionInfo) ► Promise.<Apis>`

![modifier: public](images/badges/modifier-public.png)

Gets all necessary REST API clients.
See https://github.com/Microsoft/azure-devops-node-api and https://docs.microsoft.com/en-us/rest/api/azure/devops/

Parameters | Type | Description
--- | --- | ---
__connectionInfo__ | `ConnectionInfo` | **
__*return*__ | `Promise.<Apis>` | **

---

### `createAdoTestRun(testRun)`

![modifier: public](images/badges/modifier-public.png)

Creates the Azure DevOps TestRun.

Parameters | Type | Description
--- | --- | ---
__testRun__ | `RunModel` | **

---

# Module `sql-client`

![category:private](https://img.shields.io/badge/category-private-blue.svg?style=flat-square)

**Sql client** to execute query on Miscrosoft SQL Server.
Accessible through the **executeSql** method of the TestContext instance.

[Source file](../src/sql-client.js)

## Functions

### `executeSql(connectionString, requestFunction) ► Promise.<T>`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Executes the provided function passing the sql request object.

Parameters | Type | Description
--- | --- | ---
__connectionString__ | `string` | *sql server connection string*
__requestFunction__ | `(sql: import('mssql').Request) => T` | *function using the sql request object*
__*return*__ | `Promise.<T>` | *sql query result*

---

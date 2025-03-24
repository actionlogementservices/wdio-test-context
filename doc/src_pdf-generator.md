# Module `pdf-generator`

![category:public](https://img.shields.io/badge/category-public-FF5000.svg?style=flat-square)

**Pdf file generator**.

[Source file](../src/pdf-generator.js)

## Functions

### `generatePdf(filename, context) ► Promise.<string>`

![modifier: public](images/badges/modifier-public.png)

Generates a pdf file with specified name and context data.

Parameters | Type | Description
--- | --- | ---
__filename__ | `string` | *file name*
__context__ | `import('./test-context.js').TestContext` | *test context*
__*return*__ | `Promise.<string>` | *the file path*

---

### `deletePdf(filepath)`

![modifier: public](images/badges/modifier-public.png)

Deletes the specified file.

Parameters | Type | Description
--- | --- | ---
__filepath__ | `string` | *pdf file path*

---

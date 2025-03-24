# Module `wdio/ado-reporter`

![category:public](https://img.shields.io/badge/category-public-FF5000.svg?style=flat-square)

**WDIO Reporter** to handle Azure DevOps Test Run generation.

[Source file](../src/wdio/ado-reporter.js)

## Constants

### `testRun`

![modifier: public](images/badges/modifier-public.png)

Default Azure Devops Test Run model @type {import(&#x27;../ado-client.js&#x27;).RunModel}

#### Value

```javascript
{
  name: 'Tests e2e',
  results: [],
  state: 'Completed'
}
```

---

# Class `AdoReporter`



## Methods

### `onRunnerStart(run)`

![modifier: public](images/badges/modifier-public.png)

Gets executed when the runner starts.

Parameters | Type | Description
--- | --- | ---
__run__ | `import('@wdio/reporter').RunnerStats` | *run information*

---

### `onTestPass(test)`

![modifier: public](images/badges/modifier-public.png)

Gets executed when the test passes.

Parameters | Type | Description
--- | --- | ---
__test__ | `import('@wdio/reporter').TestStats` | *test information*

---

### `onTestFail(test)`

![modifier: public](images/badges/modifier-public.png)

Gets executed when the test fails.

Parameters | Type | Description
--- | --- | ---
__test__ | `import('@wdio/reporter').TestStats` | *test information*

---

### `onTestSkip(test)`

![modifier: public](images/badges/modifier-public.png)

Gets executed when the test is skipped.

Parameters | Type | Description
--- | --- | ---
__test__ | `import('@wdio/reporter').TestStats` | *test information*

---

### `onRunnerEnd(_run)`

![modifier: public](images/badges/modifier-public.png)

Gets executed when the runner ends.

Parameters | Type | Description
--- | --- | ---
___run__ | `import('@wdio/reporter').RunnerStats` | *run information*

---

/**
 * **WDIO Reporter** to handle Azure DevOps Test Run generation.
 * @module
 * @category public
 * @public
 */

import { inspect } from 'node:util';

import WDIOReporter from '@wdio/reporter';

import { createAdoTestRun } from '../ado-client.js';
import { logger } from '../logger.js';
import { defaultDatasetName } from '../test-context.js';

/** @typedef {  import('azure-devops-node-api/interfaces/TestInterfaces.d.ts').TestCaseResult} TestResult */

/** Default Azure Devops Test Run model @type {import('../ado-client.js').RunModel} */
const testRun = {
  name: 'Tests e2e',
  results: [],
  state: 'Completed'
};

export class AdoReporter extends WDIOReporter {
  /**
   * Implements the **WDIO Reporter** that produces an Azure DevOps Test Run.
   */
  constructor(options) {
    super(options);
    this.isSynchronising = false;
  }

  get isSynchronised() {
    return this.isSynchronising;
  }

  /**
   * Gets executed when the runner starts.
   * @param {import('@wdio/reporter').RunnerStats} run run information
   */
  onRunnerStart(run) {
    const projet = process.env.SYSTEM_TEAMPROJECT;
    const dataset = process.env.DATASET || defaultDatasetName;
    const environnement = process.env.TARGET_ENV.toUpperCase();
    const buildId = process.env.BUILD_BUILDID;
    testRun.startDate = new Date().toISOString();
    testRun.name = `Tests e2e ${projet} | Scénario '${dataset}' sur ${environnement}`;
    testRun.comment = `Executé avec ${run.capabilities.browserName}(${run.capabilities.browserVersion}) | ${run.capabilities.platformName}`;
    testRun.build = { id: buildId };
  }

  /**
   * Gets executed when the test passes.
   * @param {import('@wdio/reporter').TestStats} test test information
   */
  onTestPass(test) {
    testRun.results.push({
      automatedTestName: test.fullTitle,
      testCaseTitle: test.fullTitle,
      startedDate: test.start,
      completedDate: test.end,
      outcome: 'Passed',
      state: 'Completed'
    });
  }

  /**
   * Gets executed when the test fails.
   * @param {import('@wdio/reporter').TestStats} test test information
   */
  onTestFail(test) {
    testRun.state = 'Aborted';
    testRun.results.push({
      automatedTestName: test.fullTitle,
      testCaseTitle: test.fullTitle,
      startedDate: test.start,
      completedDate: test.end,
      outcome: test.error.stack === undefined ? 'Failed' : 'Error',
      errorMessage: test.error.message,
      stackTrace: test.error.stack,
      state: 'Completed'
    });
  }

  /**
   * Gets executed when the test is skipped.
   * @param {import('@wdio/reporter').TestStats} test test information
   */
  onTestSkip(test) {
    testRun.results.push({
      automatedTestName: test.fullTitle,
      testCaseTitle: test.fullTitle,
      startedDate: test.start,
      completedDate: test.end,
      outcome: 'NotExecuted',
      state: 'Completed'
    });
  }

  /**
   * Gets executed when the runner ends.
   * @param {import('@wdio/reporter').RunnerStats} _run run information
   */
  async onRunnerEnd(_run) {
    testRun.completedDate = new Date().toISOString();
    logger.debug(inspect(testRun, { colors: true, depth: 5 }));
    await createAdoTestRun(testRun);
    this.isSynchronising = true;
  }
}

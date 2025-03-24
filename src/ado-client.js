/**
 * Azure DevOps rest client to push test results.
 * @module
 * @category internal
 */

import { WebApi, getPersonalAccessTokenHandler, getBearerHandler } from 'azure-devops-node-api';

import { logger } from './logger.js';

/** @typedef { import('azure-devops-node-api/TestApi.d.ts').ITestApi } ITestApi */
/** @typedef { { token: string, url: string, project: string } } ConnectionInfo */
/** @typedef { { testAgent: ITestApi } } Apis */
/**
 * @typedef {Omit<import('azure-devops-node-api/interfaces/TestInterfaces.d.ts').RunCreateModel, "plan" | "configurationIds"> & import('azure-devops-node-api/interfaces/TestInterfaces.d.ts').RunUpdateModel & { results: import('azure-devops-node-api/interfaces/TestInterfaces.d.ts').TestCaseResult[]}} RunModel
 */

/** @type {(input: string)=> boolean} */
const isNullOrEmpty = input => !input || !input.trim();

/**
 * Retrieves Azure DevOps connection information.
 * @returns {ConnectionInfo}
 */
function getConnectionInfo() {
  return {
    token: process.env.SYSTEM_ACCESSTOKEN || process.env.TOKEN,
    url: process.env.SYSTEM_TEAMFOUNDATIONCOLLECTIONURI,
    project: process.env.SYSTEM_TEAMPROJECT
  };
}

/**
 * Gets all necessary REST API clients.
 * See https://github.com/Microsoft/azure-devops-node-api and https://docs.microsoft.com/en-us/rest/api/azure/devops/
 * @param {ConnectionInfo} connectionInfo
 * @returns {Promise<Apis>}
 */
async function getApis(connectionInfo) {
  if (isNullOrEmpty(connectionInfo.token))
    throw new Error(
      `Impossible de récupérer l'access token de l'agent via la variable d'environnement SYSTEM_ACCESSTOKEN.`
    );
  if (isNullOrEmpty(connectionInfo.url))
    throw new Error(
      `Impossible de récupérer l'url Azure DevOps via la variable d'environnement SYSTEM_TEAMFOUNDATIONCOLLECTIONURI.`
    );
  if (isNullOrEmpty(connectionInfo.project))
    throw new Error(
      `Impossible de récupérer le projet Azure DevOps via la variable d'environnement SYSTEM_TEAMPROJECT.`
    );
  const patAuthentication = !isNullOrEmpty(process.env.TOKEN);
  const connection = new WebApi(
    connectionInfo.url,
    patAuthentication
      ? getPersonalAccessTokenHandler(connectionInfo.token)
      : getBearerHandler(connectionInfo.token)
  );
  const testAgent = await connection.getTestApi();
  return { testAgent };
}

/**
 * Creates the Azure DevOps TestRun.
 * @param {RunModel} testRun
 */
async function createAdoTestRun({ name, startDate, comment, results, state, completedDate, build }) {
  try {
    // get REST API clients
    const connectionInfo = getConnectionInfo();
    const apis = await getApis(connectionInfo);
    const testRun = await apis.testAgent.createTestRun(
      // @ts-ignore
      { automated: true, name, startDate, build, state: 'InProgress', comment },
      connectionInfo.project
    );
    if (testRun === null) throw new Error('Vérifier les droits.');
    await apis.testAgent.addTestResultsToTestRun(results, connectionInfo.project, testRun.id);
    // en cas de suite Aborted il faut déjà la sauvegarder en Completed avant sinon tous les tests sont marqués à Failed
    await apis.testAgent.updateTestRun(
      { state: 'Completed', completedDate },
      connectionInfo.project,
      testRun.id
    );
    if (state === 'Aborted')
      await apis.testAgent.updateTestRun(
        { state: 'Aborted', completedDate },
        connectionInfo.project,
        testRun.id
      );
  } catch (error) {
    logger.detailError(error);
  }
}

export { createAdoTestRun };

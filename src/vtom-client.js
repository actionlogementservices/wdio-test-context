/**
 * **Vtom client** to run Vtom job.
 * Accessible through the **runVtomJob** method of the TestContext instance.
 * @module
 * @category private
 */

import https from 'node:https';
import { constants } from 'node:crypto';

import axios from 'axios';

import { logger } from './logger.js';

/** @typedef {(environment: string, appName: string, jobName: string) => Promise<import('axios').AxiosResponse>} VtomApiCall */

/** @param {number} ms number of milliseconds to wait */
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Creates the http client.
 * @param {string} baseURL api base url
 * @param {string} apiKey vtom api key
 * @returns {import('axios').AxiosInstance}
 */
function createClient(baseURL, apiKey) {
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
    secureOptions: constants.SSL_OP_LEGACY_SERVER_CONNECT
  });
  return axios.create({
    httpsAgent,
    headers: {
      'X-API-KEY': apiKey,
      'Content-Type': 'application/json'
    },
    baseURL
  });
}

/**
 * Runs the specified vtom job.
 * @param {string} apiUrl vtom base api url
 * @param {string} apiKey vtom api key
 * @param {string} environment vtom environment
 * @param {string} appName vtom application name
 * @param {string} jobName vtom job name
 * @returns {Promise<boolean>}
 */
export async function runVtomJob(apiUrl, apiKey, environment, appName, jobName) {
  const client = createClient(apiUrl, apiKey);
  try {
    // stop job
    logger.debug(`Stopping vtom job '${jobName}'...`);
    await doAction(client, 'ChangeStatus', 'Finished')(environment, appName, jobName);
    // run job
    logger.debug(`Running vtom job '${jobName}'...`);
    await doAction(client, 'ChangeStatus', 'Running')(environment, appName, jobName);
    let jobStatus;
    let maxCount = 20;
    // check status every 5s
    do {
      const { data } = await getJobStatus(client)(environment, appName, jobName);
      jobStatus = data?.status;
      if (jobStatus === 'Finished') {
        logger.info(`Vtom job '${jobName}' finished.`);
        return true;
      }
      await wait(5000);
      logger.debug(`Checking vtom job status (${maxCount}=${jobStatus})...`);
      maxCount--;
    } while (jobStatus !== 'Finished' && maxCount > 0);
    return false;
  } catch (error) {
    logger.detailError(error);
    throw new Error(`Vtom error: '${error.message}'!`);
  }
}

/**
 * Calls the vtom job action endpoint.
 * @param {import('axios').AxiosInstance} client
 * @param {'ChangeStatus'} type
 * @param {'Running' | 'Finished'} status
 * @returns {VtomApiCall}
 */
const doAction = (client, type, status) => (environment, appName, jobName) =>
  client.post(
    `/${environment}/applications/${appName}/jobs/${jobName}/action`,
    JSON.stringify({ comment: `wdio-test: ${type}('${status}')`, type, status })
  );

/**
 * Calls the vtom job status endpoint.
 * @param {import('axios').AxiosInstance} client
 * @returns {VtomApiCall}
 */
const getJobStatus = client => (environment, appName, jobName) =>
  client.get(`/${environment}/applications/${appName}/jobs/${jobName}/status`);

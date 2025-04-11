/**
 * **Sql client** to execute query on Miscrosoft SQL Server.
 * Accessible through the **executeSql** method of the TestContext instance.
 * @module
 * @category private
 */

import { logger } from './logger.js';

// import sql from 'mssql'

/**
 * Executes the provided function passing the sql request object.
 * @template T
 * @param {string} connectionString sql server connection string
 * @param {(sql: import('mssql').Request) => T} requestFunction function using the sql request object
 * @returns {Promise<T>} sql query result
 */
export async function executeSql(connectionString, requestFunction) {
  const isOdbcDriver = connectionString.includes('Driver=');
  const sqlConfiguration = isOdbcDriver ? { driver: 'msnodesqlv8', connectionString } : connectionString;
  const sqlPackageName = isOdbcDriver ? 'mssql/msnodesqlv8.js' : 'mssql';
  const { default: sql } = await import(sqlPackageName);
  const pool = new sql.ConnectionPool(sqlConfiguration);
  try {
    const client = await pool.connect();
    const result = await requestFunction(client.request());
    logger.debug(`Sql query executed.`);
    return result;
  } catch (error) {
    logger.detailError(error);
    throw new Error(`Sql error: '${error.message}'!`);
  }
}

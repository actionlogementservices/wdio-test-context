/**
 * **Amqp client** to send message on a Amqp broker.
 * Accessible through the **publishMessage** method of the TestContext instance.
 * @module
 * @category private
 */

import amqp from 'amqplib';

import { logger } from './logger.js';

const appId = 'wdio-test';

/**
 * Publishes the message to the specified exchange of the specified amqp server.
 * @template T
 * @param {string} connectionString connection string
 * @param {string} exchange name of the exchange
 * @param {string} routingKey routing key
 * @param {string} type type of the message
 * @param {T} payload message payload
 * @param {string} correlationId correlation id for message tracking
 * @returns {Promise<boolean>}
 */
export async function publishMessage(connectionString, exchange, routingKey, type, payload, correlationId) {
  let connection;
  let channel;
  try {
    connection = await amqp.connect(connectionString, { clientProperties: { connection_name: appId } });
    channel = await connection.createChannel();
    const content = Buffer.from(JSON.stringify(payload));
    /** @type {import('amqplib').Options.Publish} */ const options = {
      appId,
      contentType: 'application/json',
      correlationId,
      timestamp: Date.now(),
      type
    };
    const result = channel.publish(exchange, routingKey, content, options);
    if (result) logger.debug('Amqp message sent.');
    return result;
  } catch (error) {
    logger.detailError(error);
    throw new Error(`Amqp error: '${error.message}'!`);
  } finally {
    if (channel) channel.close();
    if (connection) connection.close();
  }
}

# Module `amqp-client`

![category:private](https://img.shields.io/badge/category-private-blue.svg?style=flat-square)

**Amqp client** to send message on a Amqp broker.
Accessible through the **publishMessage** method of the TestContext instance.

[Source file](../src/amqp-client.js)

## Functions

### `publishMessage(connectionString, exchange, routingKey, type, payload, correlationId) ► Promise.<boolean>`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Publishes the message to the specified exchange of the specified amqp server.

Parameters | Type | Description
--- | --- | ---
__connectionString__ | `string` | *connection string*
__exchange__ | `string` | *name of the exchange*
__routingKey__ | `string` | *routing key*
__type__ | `string` | *type of the message*
__payload__ | `T` | *message payload*
__correlationId__ | `string` | *correlation id for message tracking*
__*return*__ | `Promise.<boolean>` | **

---

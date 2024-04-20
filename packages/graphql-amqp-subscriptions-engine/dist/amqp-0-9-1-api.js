/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import amqp from "amqplib";
var Status;
(function (Status) {
    Status[Status["RUNNING"] = 0] = "RUNNING";
    Status[Status["STOPPED"] = 1] = "STOPPED";
})(Status || (Status = {}));
export class AmqpApi {
    constructor({ exchange, reconnectTimeout, log = false }) {
        this.status = Status.STOPPED;
        this.exchange = exchange;
        this.reconnectTimeout = reconnectTimeout;
        this.shouldLog = log;
    }
    async connect(amqpConnection, cb) {
        this.connection = await amqp.connect(amqpConnection);
        this.log("[RabbitMQ] Connected");
        this.connection.on("close", () => {
            this.channel = undefined;
            this.warn("[RabbitMQ] Connection closed");
            if (this.status === Status.RUNNING) {
                this.reconnect(amqpConnection, cb);
            }
        });
        this.channel = await this.createChannel(this.connection);
        const queueName = await this.createQueue(this.channel);
        await this.channel.consume(queueName, (msg) => {
            if (msg !== null) {
                this.consumeMessage(msg, cb);
            }
        });
        this.status = Status.RUNNING;
    }
    publish(message) {
        if (!this.channel)
            throw new Error("AMQP Channel does not exists");
        const serializedMessage = JSON.stringify(message);
        this.channel.publish(this.exchange, "", Buffer.from(serializedMessage));
    }
    async close() {
        this.status = Status.STOPPED;
        await this.channel?.close();
        await this.connection?.close();
        this.channel = undefined;
        this.connection = undefined;
    }
    reconnect(amqpConnection, cb) {
        if (this.reconnectTimeout === undefined)
            return;
        this.log("[RabbitMQ] Reconnection Attempt");
        setTimeout(() => {
            this.connect(amqpConnection, cb).catch(() => {
                this.reconnect(amqpConnection, cb);
            });
        }, this.reconnectTimeout);
    }
    async createChannel(connection) {
        const channel = await connection.createChannel();
        await channel.assertExchange(this.exchange, "fanout", { durable: false });
        return channel;
    }
    async createQueue(channel) {
        const queue = await channel.assertQueue("", { exclusive: true }); // Creates queue with unique name, will be closed on amqp connection closed
        const queueName = queue.queue;
        await channel.bindQueue(queueName, this.exchange, ""); // binds exchange and queue
        return queueName;
    }
    consumeMessage(msg, cb) {
        const messageBody = JSON.parse(msg.content.toString());
        try {
            cb(messageBody);
        }
        catch (err) {
            this.warn("Error consuming message", err);
        }
        finally {
            this.channel?.ack(msg);
        }
    }
    log(...message) {
        if (this.shouldLog)
            console.log(...message);
    }
    warn(...message) {
        if (this.shouldLog)
            console.warn(...message);
    }
}

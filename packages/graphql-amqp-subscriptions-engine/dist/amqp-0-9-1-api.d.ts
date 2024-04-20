import amqp from "amqplib";
export type ConnectionOptions = amqp.Options.Connect | string;
type AmqpApiOptions = {
    exchange: string;
    reconnectTimeout?: number;
    log: boolean;
};
export declare class AmqpApi<T> {
    channel: amqp.Channel | undefined;
    readonly exchange: string;
    connection?: amqp.Connection;
    private status;
    private reconnectTimeout;
    private shouldLog;
    constructor({ exchange, reconnectTimeout, log }: AmqpApiOptions);
    connect(amqpConnection: ConnectionOptions, cb: (msg: T) => void): Promise<void>;
    publish(message: T): void;
    close(): Promise<void>;
    private reconnect;
    private createChannel;
    private createQueue;
    private consumeMessage;
    private log;
    private warn;
}
export {};

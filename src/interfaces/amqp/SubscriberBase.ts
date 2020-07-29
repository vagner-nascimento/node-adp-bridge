import LoggerHandler from '../../infra/logger/LoggerHandler';
import Subsciber from '../../integration/amqp/Subscriber';

export default abstract class SubscriberBase extends LoggerHandler implements Subsciber {
    constructor({ topic, consumer }, baseClassName: string, handler: (msg: any) => boolean) {
        super(baseClassName)

        this.topic = topic
        this.consumer = consumer
        this.handler = handler
    }

    private topic: string
    private consumer: string
    private handler: (msg: any) => boolean

    getTopic(): string {
        return this.topic
    }

    getConsumer(): string {
        return this.consumer
    }

    getHandler(): (msg: any) => boolean {
        return this.handler
    }
}

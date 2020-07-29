import LoggerHandler from '../../infra/logger/LoggerHandler'

import Subsciber from '../../integration/amqp/Subscriber'

export default abstract class SubscriberBase extends LoggerHandler implements Subsciber {
    constructor({ topic, consumer }, baseClassName: string, handler: (msg: any) => Promise<boolean>) {
        super(baseClassName)

        this.topic = topic
        this.consumer = consumer
        this.handler = handler
    }

    private topic: string
    private consumer: string
    private handler: (msg: any) => Promise<boolean>

    getTopic(): string {
        return this.topic
    }

    getConsumer(): string {
        return this.consumer
    }

    getHandler(): (msg: any) => Promise<boolean> {
        return this.handler
    }
}

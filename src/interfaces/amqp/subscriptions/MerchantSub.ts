import { config } from "../../../config"

import addAccount from "./AddAccount"

import { Subscription } from "../../../infra/repositories/AmqpRepository"

export class MerchantSub implements Subscription {
    constructor() {
        this.topic = config.integration.amqp.sub.merchant.topic
        this.consumer = config.integration.amqp.sub.merchant.consumer
    }

    private topic: string
    private consumer: string

    getTopic(): string {
        return this.topic
    }

    getConsumer(): string {
        return this.consumer
    }

    getHandler(): Function {
        return async (msg) => {
            await addAccount(msg.content)
        }
    }
}

import { config } from "../../../config"

import addAccount from "./AddAccount"

import { Subscription } from "../../../infra/repositories/AmqpRepository"

import Loggable from '../../../infra/logger/Loggable';

export class MerchantSub extends Loggable implements Subscription {
    constructor() {
        super(MerchantSub.name)

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

    getHandler(): (data: any) => any {
        return async (msg) => {
            try {
                const jsonData = JSON.parse(msg.content)

                this.logInfo("message data received", jsonData)

                const acc = await addAccount(jsonData)
                
                this.logInfo("account added", acc)
            } catch(err) {
                this.logError("error on try to add account", err)
            }
        }
    }
}

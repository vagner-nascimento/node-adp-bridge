import { config } from "../../../config"

import addAccount from "./AddAccount"

import { Subscription } from "../../../infra/repositories/AmqpRepository"

import Loggable from '../../../infra/logger/Loggable';

export class SellerSub extends Loggable implements Subscription {
    constructor() {
        super(SellerSub.name)

        this.topic = config.integration.amqp.sub.seller.topic
        this.consumer = config.integration.amqp.sub.seller.consumer
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

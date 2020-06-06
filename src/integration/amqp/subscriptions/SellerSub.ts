import { config } from "../../../config"

import addAccount from "./AddAccount"

import { Subscription } from "../../../infra/repositories/AmqpRepository"

export class SellerSub implements Subscription {
    constructor() {
        this.topic = config.integration.amqp.sub.seller.topic
    }

    private topic: string

    getTopic(): string {
        return this.topic
    }

    getHandler(): Function {
        return async (msg) => {
            console.log(`${this.constructor.name} - message received on topic ${this.topic}: `, msg.content.toString())

            try{
                await addAccount(msg.content)
            } catch(err) {
                console.log(`${this.constructor.name} - error on process message `, err)
            }
        }
    }
}
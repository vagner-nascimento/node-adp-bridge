import { config } from "../../../config"

import logger from "../../../infra/logger"

import addAccount from "./AddAccount"

import { Subscription } from "../../../infra/repositories/AmqpRepository"

export class SellerSub implements Subscription {
    constructor() {
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

    getHandler(): Function {
        return async (msg) => {
            logger.info(`${this.constructor.name} - message received on topic ${this.topic}`, msg.content.toString())

            try{
                await addAccount(msg.content)
            } catch(err) {
                logger.info(`${this.constructor.name} - error on process message`, err)
            }
        }
    }
}

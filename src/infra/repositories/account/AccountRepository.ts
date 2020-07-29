import AccountDataHandler from '../../../app/interfaces/AccountDataHandler'

import AmqpPublisher from '../../data/amqp/AmqpPublisher'

import { config } from "../../../config"

export default class AccountRepository implements AccountDataHandler {
    constructor() {
        this.amqpPub = new AmqpPublisher(config.integration.amqp.pub.account.topic)
    }

    private amqpPub: AmqpPublisher

    async save(data: any) {
        await this.amqpPub.publish(JSON.stringify(data))
    }
}

import AmqpSubHandler from '../../../integration/amqp/AmqpSubHandler'

import AmqpSubscriber from '../../data/amqp/AmqpSubscriber'

import { config } from '../../../config'

import LoggerHandler from '../../logger/LoggerHandler'

import Subsciber from '../../../integration/amqp/Subscriber'

export default class AmqpRepository extends LoggerHandler implements AmqpSubHandler {
    constructor() {
        super(AmqpRepository.name)
    }

    private currentSubs: Subsciber[]

    async subscibeConsumers(subs: Subsciber[]) {
        const sub = await AmqpSubscriber.getSubscriber()
        
        this.currentSubs = subs.slice()

        for(let s of subs) {
            await sub.subscribeConsumer(s.getTopic(), s.getConsumer(), s.getHandler())
        }

        sub.listenLostConnForeverEvent(() => {
            if(config.data.amqp.exitOnLostConnection) {
                this.logInfo("AMQP exit on lost conn is true. shutting down the application")

                process.exit(1)
            }
            this.logInfo("application running with AMQP subscription connection")
        })

        sub.listenReconnectEvent(async () => {
            this.logInfo("AMQP sub reconnected")
            this.subscibeConsumers(this.currentSubs)
        })
    }
}

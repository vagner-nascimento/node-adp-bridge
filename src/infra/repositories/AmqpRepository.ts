import AmqpSubHandler from '../../interfaces/amqp/AmqpSubHandler'

import Loggable from '../logging/Loggable'

import AmqpSubscriber from '../data/amqp/AmqpSubscriber'

export default class AmqpRepository extends Loggable implements AmqpSubHandler {
    constructor() {
        super(AmqpRepository.name)
    }

    public async subscribeConsumer(topic: string, consumer: string, handler: (req: any) => Promise<any>): Promise<void> {
        await AmqpSubscriber.subscribeConsumer(topic, consumer, handler)
    }
}

import AmqpSubHandler from '../../interfaces/amqp/AmqpSubHandler';

import AmqpSubConnection from '../data/amqp/AmqpSubConnection';

import Loggable from '../logging/Loggable';

import ApplicationError from '../../error/ApplicationError';

export default class AmqpRepository extends Loggable implements AmqpSubHandler {
    constructor(subConnStr: string) {
        super(AmqpRepository.name)

        this.subConnStr = subConnStr;
        this.subQueueInfo = { durable: false, autoDelete: false, exclusive: false };
        this.subcMsgInfo = { noAck: true, exclusive: false, noLocal: false };
    }

    private subConnStr: string
    private subQueueInfo: any // TODO: create a type queue and msg info
    private subcMsgInfo: any

    public async subscribeConsumer(topic: string, consumer: string, onSuccess: (req: any) => Promise<void>, onError: (err: Error) => void): Promise<void> {
        try {
            // TODO: make a class to handle channels and consume msgs
            const ch = await AmqpSubConnection.getChannel(this.subConnStr);
            
            let consumerMsgInfo = Object.assign({}, this.subcMsgInfo);
            consumerMsgInfo = Object.assign(consumerMsgInfo, { consumerTag: consumer });

            await ch.assertQueue(topic, this.subQueueInfo);
            await ch.consume(topic, onSuccess, consumerMsgInfo);
        } catch(err) {
            const msg = `error on consume topic "${topic}" with consumer "${consumer}"`
            
            this.logError(msg, err);

            onError(new ApplicationError(msg));
        }
    }
}

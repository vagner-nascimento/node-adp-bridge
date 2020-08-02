import Loggable from '../../infra/logging/Loggable';

import ApplicationError from '../../error/ApplicationError';

//TODO: get sub connection from provider through interface
import AmqpSubConnection from '../../infra/data/amqp/AmqpSubConnection';

class AmqpSubCleint extends Loggable {
    constructor(connStr: string) {
        super(AmqpSubCleint.name);

        this.connStr = connStr;        
        this.queueInfo = { durable: false, autoDelete: false, exclusive: false };
        this.msgInfo = { noAck: true, exclusive: false, noLocal: false };
    }

    private connStr: string
    private queueInfo: any // TODO: create a type queue and msg info
    private msgInfo: any

    public async subscribeConsumer(
        topic: string,
        consumer: string,
        onSuccess: (req: any) => Promise<void>,
        onError: (err: Error) => void
    ) {
        try {
            const ch = await AmqpSubConnection.getChannel(this.connStr);
            
            let consumerMsgInfo = Object.assign({}, this.msgInfo);
            consumerMsgInfo = Object.assign(consumerMsgInfo, { consumerTag: consumer });

            await ch.assertQueue(topic, this.queueInfo);
            await ch.consume(topic, onSuccess, consumerMsgInfo);
        } catch(err) {
            const msg = `error on consume topic "${topic}" with consumer "${consumer}"`
            
            this.logError(msg, err);

            onError(new ApplicationError(msg));
        }
    }
}

export default AmqpSubCleint;

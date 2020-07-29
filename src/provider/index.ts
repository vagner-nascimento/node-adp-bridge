import AmqpSubHandler from '../integration/amqp/AmqpSubHandler';

import AmqpRepository from '../infra/repositories/amqp/AmqpRepository';

export function getAmqpSubscriber(): AmqpSubHandler {
    return new AmqpRepository()
}

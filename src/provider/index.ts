import AmqpSubHandler from '../interfaces/amqp/AmqpSubHandler';

import AmqpRepository from '../infra/repositories/AmqpRepository';

export function getAmqpSubHandler(connStr: string): AmqpSubHandler {
    return new AmqpRepository(connStr);
}

import AmqpSubHandler from '../integration/amqp/AmqpSubHandler'

import AmqpRepository from '../infra/repositories/amqp/AmqpRepository'

import AccountAdapter from '../app/adapters/AccountAdapter'
import AccountRepository from '../infra/repositories/account/AccountRepository';

export function getAmqpSubscriber(): AmqpSubHandler {
    return new AmqpRepository()
}

export function getAccountAdapter(): AccountAdapter {
    return new AccountAdapter(new AccountRepository())
}
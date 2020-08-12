import AmqpSubHandler from '../interfaces/amqp/AmqpSubHandler'

import AmqpRepository from '../infra/repositories/AmqpRepository'

import AccountAdpHandler from '../app/handlers/AccountAdpHandler'

import AccountAdapter from '../app/adapters/AccountAdapter'

import AccountRepository from '../infra/repositories/account/AccountRepository'

export function getAmqpSubHandler(): AmqpSubHandler {
    return new AmqpRepository()
}

export function getAccountAdapter(): AccountAdpHandler {
    return new AccountAdapter(new AccountRepository())
}

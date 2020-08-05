import AmqpSubHandler from '../interfaces/amqp/AmqpSubHandler'

import AmqpRepository from '../infra/repositories/AmqpRepository'

import AccountAdpHandler from '../app/handlers/AccountAdpHandler'

import AccountAdapter from '../app/adapters/AccountAdapter'

import AccountRepository from '../infra/repositories/account/AccountRepository'

export function getAmqpSubHandler(connStr: string): AmqpSubHandler {
    return new AmqpRepository(connStr)
}

export function getAccountAdapter(): AccountAdpHandler {
    return new AccountAdapter(new AccountRepository())
}

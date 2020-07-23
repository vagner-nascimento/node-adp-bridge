import { AccountAdapter } from "../app/adapters/AccountAdapter"

import { AccountRepository } from "../infra/repositories/amqp/AccountRepository"

export function getAccountAdapter(): AccountAdapter {
    return AccountAdapter.getInstance(new AccountRepository)
}

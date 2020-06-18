import { AccountRepository } from "../infra/repositories/AccountRepository"

import { AccountAdapter } from "../app/adapters/AccountAdapter"

export function getAccountAdapter(): AccountAdapter {
    return new AccountAdapter(new AccountRepository())
}

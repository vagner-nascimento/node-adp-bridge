import { AccountAdapter } from "../app/adapters/AccountAdapter"

import { AccountRepository } from "../infra/repositories/AccountRepository"

export function getAccountAdapter(): AccountAdapter {
    return AccountAdapter.getInstance(new AccountRepository)
}

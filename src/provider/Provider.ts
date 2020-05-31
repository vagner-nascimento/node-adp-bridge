import { AccountRepository } from '../infra/repositories/AccountRepository'

import { AccountAdapter } from '../app/adapters/AccountAdapter';

export function getAccountAdatapter(): AccountAdapter {
    return new AccountAdapter(new AccountRepository())
}
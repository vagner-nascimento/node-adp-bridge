import AccountAdpHandler from '../handlers/AccountAdpHandler'

import AccountDataHandler from '../handlers/AccountDataHandler'

import Account from '../types/Account'

import { createAccount } from '../usecases/AccountUs'

export default class AccountAdapter implements AccountAdpHandler {
    constructor(repository: AccountDataHandler) {
        this.repository = repository
    }

    private repository: AccountDataHandler

    public async addAccount(entity: any): Promise<Account> {
        const acc = createAccount(entity)

        return await this.repository.save(acc)
    }
}

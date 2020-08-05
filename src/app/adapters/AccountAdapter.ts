import AccountAdpHandler from '../handlers/AccountAdpHandler'

import AccountDataHandler from '../handlers/AccountDataHandler'

import Account from '../types/Account'

import { createAccount, enrichAccount } from '../usecases/AccountUs'

export default class AccountAdapter implements AccountAdpHandler {
    constructor(repository: AccountDataHandler) {
        this.repository = repository
    }

    private repository: AccountDataHandler

    public async addAccount(entity: any): Promise<Account> {
        let acc = createAccount(entity)
        acc = await enrichAccount(acc, this.repository)

        return await this.repository.save(acc)
    }
}

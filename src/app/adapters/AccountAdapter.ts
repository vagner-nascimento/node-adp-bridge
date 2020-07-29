import AccountDataHandler from '../interfaces/AccountDataHandler'

import LoggerHandler from '../../infra/logger/LoggerHandler'

export default class AccountAdapter extends LoggerHandler {
    constructor(repo: AccountDataHandler) {
        super(AccountAdapter.name)

        this.repo = repo
    }
    private repo: AccountDataHandler

    public async addAccount(entity: any) {
        await this.repo.save(entity)
    }
}

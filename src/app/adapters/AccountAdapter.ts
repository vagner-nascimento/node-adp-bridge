import AccountDataHandler from '../interfaces/AccountDataHandler';

import CreateAccount from '../usecases/CreateAccount';

import Account from '../entities/Account';

export class AccountAdapter {
    constructor(repository: AccountDataHandler) {
        this.repo = repository
    }

    private repo: AccountDataHandler
    
    public async addAccount(data: any): Promise<Account> {
        const acc = CreateAccount(data)
                
        return await this.repo.Save(acc)
    }
}
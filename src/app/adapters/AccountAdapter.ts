import AccountDataHandler from '../interfaces/AccountDataHandler';
import { Account } from '../entities/Account';

export class AccountAdapter {
    constructor(repository: AccountDataHandler) {
        this.repo = repository
    }

    private repo: AccountDataHandler

    // TODO realise how to recive a properly account
    public async addAccount(data: any): Promise<Account> {
        const acc = new Account(data.id)
                
        return await this.repo.Save(acc)
    }
}
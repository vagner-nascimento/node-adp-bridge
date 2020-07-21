import AccountDataHandler from "../interfaces/AccountDataHandler"

import createAccount from "../usecases/CreateAccount"
import getEnrichedAccountData from "../usecases/EnrichAccountData"

import Account from "../entities/Account"

export class AccountAdapter {
    private constructor(repository: AccountDataHandler) {
        this.repo = repository
    }

    private repo: AccountDataHandler
    private static instance: AccountAdapter

    public static getInstance(repository: AccountDataHandler) {
        if(!this.instance) this.instance = new AccountAdapter(repository)

        return this.instance
    }
    
    public async addAccount(data: any): Promise<Account> {
        const acc = createAccount(data)
        const enrichedAccount = await getEnrichedAccountData(acc, this.repo, data)
                        
        return await this.repo.Save(enrichedAccount)
    }
}

import AccountDataHandler from "../interfaces/AccountDataHandler"

import createAccount from "../usecases/CreateAccount"
import { getEnrichmentStrategy } from "../usecases/EnrichAccountData"

import Account from "../entities/Account"

export class AccountAdapter {
    constructor(repository: AccountDataHandler) {
        this.repo = repository
    }

    private repo: AccountDataHandler
    
    public async addAccount(data: any): Promise<Account> {
        const acc = createAccount(data)
        const doEnrichment = getEnrichmentStrategy(acc.type, this.repo, data)
        const enrichedAccount = await doEnrichment(acc)
                
        return await this.repo.Save(enrichedAccount)
    }
}

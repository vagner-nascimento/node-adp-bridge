import AccountDataHandler from '../interfaces/AccountDataHandler';

import CreateAccount from '../usecases/CreateAccount';

import Account from '../entities/Account';
import { getEnrichmentStrategy } from '../usecases/EnrichAccountData';

export class AccountAdapter {
    constructor(repository: AccountDataHandler) {
        this.repo = repository
    }

    private repo: AccountDataHandler
    
    public async addAccount(data: any): Promise<Account> {
        const acc = CreateAccount(data)
        const doEnrichment = getEnrichmentStrategy(acc.type, this.repo, data)
        const enrichedAccount = await doEnrichment(acc)
                
        return await this.repo.Save(enrichedAccount)
    }
}
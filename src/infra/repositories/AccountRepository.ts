import SingletRabbitConn from "../data/rabbitmq/SingletRabbitConn"

//TODO realise how to import using relative path (src/.../.../Etc) with NODE_PATH=.
import AccountDataHandler from '../../app/interfaces/AccountDataHandler';

import MerchantRestClient from '../../integration/http/MerchantRestClient';

import Account from '../../app/entities/Account';
import Merchant from '../../app/entities/Merchant';
import MerchantAccount from "../../app/entities/MerchantAccount";
import MerchantsAccountsClient from '../../integration/http/MerchantsAccountsClient';

// TODO put infos into app confs
export class AccountRepository implements AccountDataHandler {
    constructor() {
        this.merchantCli = new MerchantRestClient({ baseUrl: "http://rest-mock:4000/merchants", timeout: 10000 })
        this.merchantAccsCli = new MerchantsAccountsClient({ baseUrl: "http://rest-mock:4000/merchant-accounts", timeout: 10000})
    }

    private merchantCli: MerchantRestClient
    private merchantAccsCli: MerchantsAccountsClient

    async Save(acc: Account): Promise<Account> {
        const conn = await SingletRabbitConn.getInstance()
        await conn.publish("q-accounts", JSON.stringify(acc))
        
        console.log("account saved ", acc)

        return acc
    }

    async GetMerchant(merchanId: string): Promise<Merchant> {
        return await this.merchantCli.getMerchant(merchanId)
    }

    async GetMerchantAccounts(merchantId: string): Promise<MerchantAccount[]> {
        return await this.merchantAccsCli.getByMerchant(merchantId)
    }
    
    async GetMerchantAccount(accId: string): Promise<MerchantAccount> {
        return await this.merchantAccsCli.getAccount(accId)
    }
}
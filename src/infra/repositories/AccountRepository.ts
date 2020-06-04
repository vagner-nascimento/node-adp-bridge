import SingletRabbitConn from "../data/rabbitmq/SingletRabbitConn"

//TODO realise how to import using relative path (src/.../.../Etc) with NODE_PATH=.
import AccountDataHandler from "../../app/interfaces/AccountDataHandler"

import MerchantRestClient from "../../integration/http/MerchantRestClient"

import Account from "../../app/entities/Account"
import Merchant from "../../app/entities/Merchant"
import MerchantAccount from "../../app/entities/MerchantAccount"
import MerchantsAccountsClient from "../../integration/http/MerchantsAccountsClient"

import { config } from "../../config"

export class AccountRepository implements AccountDataHandler {
    constructor() {
        const {
            merchants,
            merchantsAccounts,
        } = config.integration.rest

        this.merchantCli = new MerchantRestClient(merchants)
        this.merchantAccCli = new MerchantsAccountsClient(merchantsAccounts)
    }

    private merchantCli: MerchantRestClient
    private merchantAccCli: MerchantsAccountsClient

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
        return await this.merchantAccCli.getByMerchant(merchantId)
    }
    
    async GetMerchantAccount(accId: string): Promise<MerchantAccount> {
        return await this.merchantAccCli.getAccount(accId)
    }
}
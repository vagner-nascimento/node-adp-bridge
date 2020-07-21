import AmqpServer from "../data/amqp/AmqpServer"

//TODO realise how to import using relative path (src/.../.../Etc) with NODE_PATH=.
import AccountDataHandler from "../../app/interfaces/AccountDataHandler"

import { Account, Merchant, MerchantAccount, Affiliation } from "../../app/entities"

import { MerchantsClient, MerchantAccountsClient, AffiliationsClient } from "../../integration/rest"

import { config } from "../../config"

export class AccountRepository implements AccountDataHandler {
    constructor() {
        this.accountTopic = config.integration.amqp.pub.account.topic
    }

    private accountTopic: string

    async Save(acc: Account): Promise<Account> {
        await AmqpServer.publish(this.accountTopic, JSON.stringify(acc))
        
        return acc
    }

    async GetMerchantAccount(accId: string): Promise<MerchantAccount> {
        return await MerchantAccountsClient.getAccount(accId)
    }

    async GetMerchantAccounts(merchantId: string): Promise<MerchantAccount[]> {
        return await MerchantAccountsClient.getByMerchant(merchantId)
    }

    async GetMerchant(merchantId: string): Promise<Merchant> {
        return await MerchantsClient.getMerchant(merchantId)
    }

    async GetMerchantAffiliation(merchantId: string): Promise<Affiliation> {
        return await AffiliationsClient.getByMerchant(merchantId)
    }
}

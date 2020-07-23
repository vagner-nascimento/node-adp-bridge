import AmqpPublisher from "../../data/amqp/AmqpPublisher"

//TODO realise how to import using relative path (src/.../.../Etc) with NODE_PATH=.
import AccountDataHandler from "../../../app/interfaces/AccountDataHandler"

import { Account, Merchant, MerchantAccount, Affiliation } from "../../../app/entities"

import { MerchantsClient, MerchantAccountsClient, AffiliationsClient } from "../../../integration/rest"

import { config } from "../../../config"

export class AccountRepository implements AccountDataHandler {
    constructor() {
        this.accountTopic = config.integration.amqp.pub.account.topic
    }

    private accountTopic: string

    public async save(acc: Account): Promise<Account> {
        await AmqpPublisher.publishMessage(this.accountTopic, JSON.stringify(acc))
        
        return acc
    }

    public async getMerchantAccount(accId: string): Promise<MerchantAccount> {
        return await MerchantAccountsClient.getAccount(accId)
    }

    public async getMerchantAccounts(merchantId: string): Promise<MerchantAccount[]> {
        return await MerchantAccountsClient.getByMerchant(merchantId)
    }

    public async getMerchant(merchantId: string): Promise<Merchant> {
        return await MerchantsClient.getMerchant(merchantId)
    }

    public async getMerchantAffiliation(merchantId: string): Promise<Affiliation> {
        return await AffiliationsClient.getByMerchant(merchantId)
    }
}

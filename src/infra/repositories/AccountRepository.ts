import SingletRabbitConn from "../data/rabbitmq/SingletRabbitConn"

//TODO realise how to import using relative path (src/.../.../Etc) with NODE_PATH=.
import AccountDataHandler from "../../app/interfaces/AccountDataHandler"

import MerchantsClient from "../../integration/http/MerchantsClient"
import MerchantAccountsClient from "../../integration/http/MerchantAccountsClient"
import AffiliationsClient from "../../integration/http/AffiliationsClient"

import Account from "../../app/entities/Account"
import Merchant from "../../app/entities/Merchant"
import MerchantAccount from "../../app/entities/MerchantAccount"
import Affiliation from "../../app/entities/Affiliation"

import logger from "../logger"
import { config } from "../../config"

export class AccountRepository implements AccountDataHandler {
    constructor() {
        const {
            merchants,
            affiliations,
            merchantsAccounts
        } = config.integration.rest

        this.merchantsCli = new MerchantsClient(merchants)
        this.merchantAccCli = new MerchantAccountsClient(merchantsAccounts)
        this.affiliationsCli = new AffiliationsClient(affiliations)
        this.accountTopic = config.integration.amqp.pub.account.topic
    }

    private merchantsCli: MerchantsClient
    private merchantAccCli: MerchantAccountsClient
    private affiliationsCli: AffiliationsClient
    private accountTopic: string

    async Save(acc: Account): Promise<Account> {
        const conn = await SingletRabbitConn.getInstance()        
        await conn.publish(this.accountTopic, JSON.stringify(acc))
        
        logger.info("account saved ", acc)

        return acc
    }

    async GetMerchant(merchantId: string): Promise<Merchant> {
        return await this.merchantsCli.getMerchant(merchantId)
    }

    async GetMerchantAccounts(merchantId: string): Promise<MerchantAccount[]> {
        return await this.merchantAccCli.getByMerchant(merchantId)
    }
    
    async GetMerchantAccount(accId: string): Promise<MerchantAccount> {
        return await this.merchantAccCli.getAccount(accId)
    }

    async GetMerchantAffiliation(merchantId: string): Promise<Affiliation> {
        return await this.affiliationsCli.getByMerchant(merchantId)
    }
}
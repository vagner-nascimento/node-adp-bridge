import config from '../../../../config'

import AccountDataHandler from '../../../app/handlers/AccountDataHandler'

import Loggable from '../../logging/Loggable'

import MerchantAccountsClient from '../../../integration/http/merchant/MerchantAccountsClient'
import MerchantsClient from '../../../integration/http/merchant/MerchantsClient'
import AffiliationsClient from '../../../integration/http/affiliation/AffiliationsClient'

import Account from '../../../app/types/Account'
import MerchantAccount from '../../../app/types/MerchantAccount'
import Merchant from '../../../app/types/Merchant'
import Affiliation from '../../../app/types/Affiliation'

import AmqpPublisher from '../../data/amqp/AmqpPublisher'

export default class AccountRepository extends Loggable implements AccountDataHandler {
    constructor() {
        super(AccountRepository.name)

        const {
            integration: {
                amqp: {
                    rabbitMq: {
                        topics: {
                            pub: {
                                account: {
                                    topicName
                                }
                            }
                        }
                    }
                }
            }
        } = config

        this.topicName = topicName
    }

    private topicName: string

    public async save(acc: Account): Promise<Account> {
        this.logInfo('account to be saved', acc)
        
        await AmqpPublisher.publish(this.topicName, JSON.stringify(acc))

        return acc
    }

    public async getMerchant(id: string): Promise<Merchant> {
        return await MerchantsClient.getMerchant(id)
    }

    public async getMerchantAccount(id: string): Promise<MerchantAccount> {
        return await MerchantAccountsClient.getAccount(id)
    }
    
    public async getMerchantAccounts(merchantId: string): Promise<MerchantAccount[]> {
        return await MerchantAccountsClient.getByMerchant(merchantId)
    }

    public async getAffiliation(id: string): Promise<Affiliation> {
        return await AffiliationsClient.getAffiliation(id)
    }
}

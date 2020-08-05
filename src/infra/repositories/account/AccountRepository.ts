import AccountDataHandler from '../../../app/handlers/AccountDataHandler'

import Account from '../../../app/types/Account'

import Loggable from '../../logging/Loggable'

import AmqpPublisger from '../../data/amqp/AmqpPublisher'

import config from '../../../../config'

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
                                    connectionString,
                                    topicName
                                }
                            }
                        }
                    }
                }
            }
        } = config

        this.pub = new AmqpPublisger(connectionString)
        this.topicName = topicName
    }

    private pub: AmqpPublisger
    private topicName: string

    public async save(acc: Account): Promise<Account> {
        this.logInfo('account to be saved', acc)
        
        await this.pub.publish(this.topicName, JSON.stringify(acc))

        return acc
    }
}

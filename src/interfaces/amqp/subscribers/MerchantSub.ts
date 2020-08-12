import Subscriber from './Subscriber'

import logger from '../../../infra/logging'

import config from '../../../../config'

import { getAccountAdapter } from '../../../provider'

import AccountAdpHandler from '../../../app/handlers/AccountAdpHandler'

import Merchant from '../../../app/types/Merchant'

export default class MerchantSub implements Subscriber {  
    constructor() {
        const {
            integration: {
                amqp: {
                    rabbitMq: {
                        topics: {
                            sub: {
                                merchant: {                        
                                    connectionString,
                                    topicName,
                                    subName,
                                    autoComplete = false                        
                                }
                            }
                        }
                    }
                }
            }
        } = config

        this.connStr = connectionString
        this.topic = topicName
        this.consumer = subName
        this.autoComplete = autoComplete
    }

    private connStr: string
    private topic: string
    private consumer: string
    private autoComplete: boolean

    public getConnStr(): string {
        return this.connStr
    }

    public getTopic(): string {
        return this.topic
    }

    public getConsumer(): string {
        return this.consumer
    }

    public getAutoComplete(): boolean {
        return this.autoComplete
    }

    public getHandler(): (message: any) => Promise<any> {
        return async (message: any) => {
            const logMsg = (msg: string, data: any) => {
                msg = `${MerchantSub.name} - ${msg}`
                if(data instanceof Error) logger.error(msg, data)
                else logger.info(msg, data)
            }

            const accAdp: AccountAdpHandler = getAccountAdapter()

            try {
                const data = JSON.parse(message.content)

                logMsg('message data', data)

                const mer = new Merchant(data)
                const acc = await accAdp.addAccount(mer)
                
                logMsg('account added', acc)
            } catch(err) {
                logMsg('error', err)
            }
        }
    }
}

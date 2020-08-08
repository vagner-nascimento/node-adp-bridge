import config from '../../../config'

import logger from '../../infra/logging'

import Subscriber from './subscribers/Subscriber'

import AmqpSubHandler from './AmqpSubHandler'

import { getSubscribers } from './subscribers'

import { getAmqpSubHandler } from '../../provider'

const {
    integration: {
        amqp: {
            rabbitMq: {
                retryPolicy                
            }
        }
    }
} = config

const thisName = 'AMQPSubscriber'

const logMessage = (msg: string, err: Error = null): void => {
    if(err)  logger.error(`${thisName} - ${msg}`, err)
    else logger.info(`${thisName} - ${msg}`)
}

const subscribe = async (sub: Subscriber): Promise<void> => {
    const subHandler: AmqpSubHandler = getAmqpSubHandler(sub.getConnStr())

    await subHandler.subscribeConsumer(
        sub.getTopic(),
        sub.getConsumer(),
        sub.handleMessage,
        (err: Error) => {
            logMessage('message error', err)
                    
            if(retryPolicy && retryPolicy.toLowerCase() === 'exit') {
                logMessage('retry police is "exit": exiting application')
                process.exit(1)
            }

            logMessage('retry police is NOT "exit": keep runnig the application')
        })

    logMessage(`consumer "${sub.getConsumer()}" subsribed into "${sub.getTopic()}" topic`)
}

export async function subscribeConsumers(): Promise<void> {
    for(const sub of getSubscribers()) await subscribe(sub)
}

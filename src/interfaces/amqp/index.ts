import { ServiceBusClient, ReceiveMode} from '@azure/service-bus';

import logger from '../../infra/logging/Logger';

import config from '../../../config';

import Subscriber from './subscribers/Subscriber';

import { getSubscribers } from './subscribers';

const {
    integration: {
        amqp: {
            rabbitMq: {
                retryPolicy                
            }
        }
    }
} = config;

const thisName = 'AMQPSubscriber';

const logMessage = (msg: string, err: Error = null): void => {
    if(err)  logger.error(`${thisName} - ${msg}`, err);
    else logger.info(`${thisName} - ${msg}`);
}

const subscribe = (sub: Subscriber): void => {
    ServiceBusClient
        .createFromConnectionString(sub.getConnStr())
        .createSubscriptionClient(sub.getTopic(), sub.getConsumer())
        .createReceiver(ReceiveMode.peekLock)
        .registerMessageHandler(
            servicebusRequest => sub.processMessage(servicebusRequest),
            error => {
                logMessage('message error', error);
                
                if(retryPolicy && retryPolicy.toLowerCase() === 'exit') {
                    logMessage('retry police is "exit": exiting application');
                    process.exit(1);
                }

                logMessage('retry police is NOT "exit": keep runnig the application');
            },
            {
                autoComplete: sub.getAutoComplete()
            }
        );

    logMessage(`subscription of "${sub.getConsumer()}" into "${sub.getTopic()}" requested`);
}

export async function subscribeConsumers(): Promise<void> {
    getSubscribers()
        .forEach(subscribe)
}

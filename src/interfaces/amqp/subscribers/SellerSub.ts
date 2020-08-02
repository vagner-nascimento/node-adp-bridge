import Subscriber from './Subscriber';

import Loggable from '../../../infra/logging/Loggable';

import config from '../../../../config';

import logger from '../../../infra/logging/Logger';

class SellerSub extends Loggable implements Subscriber {
    constructor() {
        super(SellerSub.name)

        const {
            integration: {
                amqp: {
                    rabbitMq: {
                        topics: {
                            sub: {
                                seller: {
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
        } = config;

        this.connStr = connectionString;
        this.topic = topicName;
        this.consumer = subName;
        this.autoComplete = autoComplete;
    }

    private connStr: string;
    private topic: string;
    private consumer: string;
    private autoComplete: boolean;

    public getConnStr(): string {
        return this.connStr;
    }

    public getTopic(): string {
        return this.topic;
    }

    public getConsumer(): string {
        return this.consumer;
    }

    public getAutoComplete(): boolean {
        return this.autoComplete;
    }

    public async handleMessage(msg: any): Promise<void> {
        const logMsg = (msg: string, data: any) => {
            msg = `${SellerSub.name} - ${msg}`
            if(data instanceof Error) logger.error(msg, data)
            else logger.info(msg, data)
        }

        try {
            logMsg('message data', JSON.parse(msg.content))
            // TODO: call addAccount adapter
        } catch(err) {
            logMsg('error', err);
        }
    }
}

export default new SellerSub();

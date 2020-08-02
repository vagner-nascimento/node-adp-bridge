import Subscriber from './Subscriber';

import Loggable from '../../../infra/logging/Loggable';

import config from '../../../../config';

class MerchantSub extends Loggable implements Subscriber {  
    constructor() {
        super(MerchantSub.name);

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

    public async processMessage(msg: any): Promise<void> {
        try {
            this.logInfo('message data', msg.body);
            // TODO: call addAccount adapter
            await msg.complete();

            this.logInfo('message completed');
        } catch(err) {
            this.logError('error', err);

            await msg.deadLetter({ deadletterReason: 'error', deadLetterErrorDescription: err.message });

            this.logInfo('message sent to dead letter');
        }
    }
}

export default new MerchantSub();

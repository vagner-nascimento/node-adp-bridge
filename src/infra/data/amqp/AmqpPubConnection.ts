import amqplib from 'amqplib';

import Loggable from '../../logging/Loggable';

import ApplicationError from '../../../error/ApplicationError';

export default class AmqpPubConnection extends Loggable {
    private constructor() {
        super(AmqpPubConnection.name);

        this.conns = new Map();
    }

    private conns: Map<string, any>;
    private static instance: AmqpPubConnection; 

    public static async getNewChannel(connStr: string): Promise<amqplib.Channel> {
        if(!AmqpPubConnection.instance) {
            AmqpPubConnection.instance = new AmqpPubConnection();
        }
        
        let conn = AmqpPubConnection.instance.conns.get(connStr);
        if(!conn) {
            conn = await AmqpPubConnection.instance.connect(connStr);
            AmqpPubConnection.instance.conns.set(connStr, conn);
        }

        return await AmqpPubConnection.instance.createChannel(conn);
    }

    private async connect(connStr: string): Promise<any> {
        try {
            this.logInfo('connecting into AMQP server')

            const conn = await amqplib.connect(connStr);

            this.logInfo('successfully connected into AMQP server')            

            conn.connection.on('close', err => {
                const msg = 'AMQP connection CLOSED';
                
                this.logError(msg, err);                
            });

            conn.connection.on('error', err => {
                const msg = 'AMQP connection ERROR';

                this.logError(msg, err);
            });

            return conn;
        } catch(err) {
            const msg = `error on try to connect into amqp server`

            this.logError(msg, err)

            throw new ApplicationError(msg)
        }
    }

    private async createChannel(conn: any): Promise<amqplib.Channel> {
        try {
            this.logInfo('creating a new AMQP channel')

            return await conn.createChannel();
        } catch(err) {
            const msg = 'error on create a new AMQP channel';
            this.logError(msg, err)

            throw new ApplicationError(msg);
        }
    }
}

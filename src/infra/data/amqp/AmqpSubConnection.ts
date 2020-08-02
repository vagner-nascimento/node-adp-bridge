import amqplib from 'amqplib';

import Loggable from '../../logging/Loggable';

import ApplicationError from '../../../error/ApplicationError';

class AmqpSubConnection extends Loggable {
    private constructor() {
        super(AmqpSubConnection.name);

        this.conns = new Map();
        this.channels = new Map();
    }

    // TODO: unify amqp conn and channel
    private conns: Map<string, any>;
    private channels: Map<string, amqplib.Channel>;
    private static instance: AmqpSubConnection;

    public static async getChannel(connStr: string): Promise<amqplib.Channel> {
        if(!AmqpSubConnection.instance) {
            console.info("SUB CONN NEW INSTANCE")
            AmqpSubConnection.instance = new AmqpSubConnection();
        }
        
        let conn = AmqpSubConnection.instance.conns.get(connStr);
        if(conn) {
            return AmqpSubConnection.instance.channels.get(connStr);
        }

        conn = await AmqpSubConnection.instance.connect(connStr);
        AmqpSubConnection.instance.conns.set(connStr, conn);

        const ch = await AmqpSubConnection.instance.createChannel(conn);
        AmqpSubConnection.instance.channels.set(connStr, ch);

        return ch;
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

export default AmqpSubConnection;

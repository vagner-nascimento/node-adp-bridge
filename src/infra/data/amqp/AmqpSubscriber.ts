import amqplib from 'amqplib';

import { config } from "../../../config"

import AppEventEmiter from "../../../events/AppEventEmiter"
import { AmqpEvents } from '../../repositories/amqp/AmqpEventsEnum';

/**
 * - Singleton
 * - Retry
 * - lost conn police
 */
 class AmqpSubscriber {
     constructor() {
        this.connStr = config.data.amqp.connStr
        this.startConnection()
     }

     private conn: any
     private chann: amqplib.Channel
     private connStr: string

     private async connect() {
        this.conn = await amqplib.connect()
             
        AppEventEmiter.emit(AmqpEvents.AMQP_SUB_CONNECTED)

        this.conn.connection.on("close", () => "retry")
        this.conn.connection.on("error", () => "retry")
     }

     private async startConnection() {
         try {
             await this.connect()
         } catch(err) {
             // retry
         }
     }
 }
 
import { loadEnvironment } from '../../config/ConfigLoader'
const conf = loadEnvironment()

import logger from '../infra/logging/Logger'

import { startHttpServer } from '../interfaces/http'

import { subscribeConsumers } from '../interfaces/amqp'

export default async (): Promise<void> => {
    logger.info('**CONFIGS**', conf)
    
    await subscribeConsumers()
    await startHttpServer()
}

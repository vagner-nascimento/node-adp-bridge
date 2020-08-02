import { loadEnvironment } from '../../config/ConfigLoader'

const conf = loadEnvironment()

import logger from '../infra/logging/Logger'

export default async (): Promise<void> => {
    logger.info('**CONFIGS**', conf);
    
    // TODO: load rest and amqp interfaces
}

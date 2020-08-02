import { loadEnvironment } from '../../config/ConfigLoader'
const conf = loadEnvironment()

import logger from '../infra/logging/Logger'
import { start as startHttpServer } from '../interfaces/http/Server';

export default async (): Promise<void> => {
    logger.info('**CONFIGS**', conf);
    
    await startHttpServer()
    // TODO: load interface
}

import { loadConfig } from "../config"
const conf = loadConfig()

import subscribeConsumers from "../interfaces/amqp/Subscriber"

import startRestPresentation from "../interfaces/rest/Server"

import logger from "../infra/logger"

export default async (): Promise<void> => {   
    logger.info("**CONFIGS**", JSON.stringify(conf))

    await subscribeConsumers()
    await startRestPresentation()
}

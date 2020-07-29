import { loadConfig } from "../config"
const conf = loadConfig()

import logger from "../infra/logger"

import startRestInterface from "../interfaces/rest"

import { subscribeConsumers } from "../interfaces/amqp"

export default async (): Promise<void> => {   
    logger.info("**CONFIGS**", JSON.stringify(conf))

    await subscribeConsumers()
    await startRestInterface()
}

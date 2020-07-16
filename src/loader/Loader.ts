import subscribeConsumers from "../integration/amqp/Subscriber"

import startRestPresentation from "../presentation/rest/Server"

import { loadConfig } from "../config"

const conf = loadConfig()

import logger from "../infra/logger"

export default async (): Promise<void> => {   
    logger.info("**CONFIGS**", JSON.stringify(conf))

    await subscribeConsumers()
    await startRestPresentation()
}

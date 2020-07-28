import { loadConfig } from "../config"
const conf = loadConfig()

import logger from "../infra/logger"

import startRestInterface from "../interfaces/rest/Server"

export default async (): Promise<void> => {   
    logger.info("**CONFIGS**", JSON.stringify(conf))

    await startRestInterface()
}

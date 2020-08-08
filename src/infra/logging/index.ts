import config from '../../../config'

import Logger from './Logger'

import ConsoleLogger from './loggers/ConsoleLogger'
import GrafanaLogger from './loggers/GrafanaLogger'

let singleLogger: Logger = null

const getLogger = (): Logger => {
    if(singleLogger === null) {
        if(['LOCAL', 'DOCKER'].includes(config.env)) singleLogger = new ConsoleLogger()
        else singleLogger = new GrafanaLogger()

        singleLogger.info(`LOGGER - using ${singleLogger.constructor.name}`)
    }

    return singleLogger
}

export default getLogger()

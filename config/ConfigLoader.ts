import path from 'path'

let env = process.env.NODE_ENV || 'NONE_ENV'
const instance = process.env.NODE_INSTANCE || 'NONE_INSTANCE'
const info = require(path.join(__dirname, 'info.json'))
const envConfigFile = require('./environment')

const printInfo = (msg: string, data: any = null): void => {
    console.info(`CONFIG - ${msg}`, data ? data : '')
}

export function loadEnvironment(): any {
    let envProps: any = {}
    
    if(env) env = env.toUpperCase()

    printInfo('"NODE_ENV"', env)

    if(env === 'LOCAL') {
        envProps = require('scripts/properties/local')

        printInfo('overriding with LOCAL config')
    } else if(env === 'DOCKER') {
        envProps = require('scripts/properties/docker')

        printInfo('overriding with DOCKER config')
    } else {
        envProps = require('./env')

        printInfo('overriding with "config/env.json" config')
    }
    
    const config = {
        env,
        instance,
        info,
        ...envProps
    }

    for (let property of Object.keys(config))
        envConfigFile[property] = config[property]
    
    return envConfigFile
}

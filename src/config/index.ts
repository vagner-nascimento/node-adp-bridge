import SingletonConfig from "./SingletonConfig"

const  loadConfig = (): any => {
    return SingletonConfig.getInstance().getConfig()
}

const config = loadConfig()

export {
    loadConfig,
    config
}
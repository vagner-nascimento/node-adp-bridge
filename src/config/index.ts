import SingletonConfig from "./SingletonConfig"

let config: any

const  loadConfig = (): any => {
    config = SingletonConfig.getInstance().getConfig()
    
    return config
}


export {
    loadConfig,
    config
}
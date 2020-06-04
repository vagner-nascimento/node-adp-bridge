const loadConfig = (): any => {
    let env = process.env.NODE_ENV
    console.log("**ENV** ", env ? env : "env not informed")

    if(env) env = env.toLowerCase()
    else env = "local"

    const conf = require(`./${env}`)

    return {
        env,
        ...conf
    }
}

export default class SingletonConfig {
    private constructor() {
        this.envConfig = loadConfig()
    }

    private envConfig: any
    private static instance: SingletonConfig

    static getInstance(): SingletonConfig {
        if(!SingletonConfig.instance) SingletonConfig.instance = new SingletonConfig()

        return SingletonConfig.instance
    }
    
    public getConfig(): any {
        return this.envConfig
    }
}
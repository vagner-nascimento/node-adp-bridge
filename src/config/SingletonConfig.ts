const loadConfig = (): any => {
    let env = process.env.NODE_ENV
    
    if(env) env = env.toLowerCase()
    else {
        env = "local"
        console.log("NODE_ENV not informed, setted 'local'")
    }

    console.log("**NODE_ENV** ", env)

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
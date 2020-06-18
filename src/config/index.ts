let config: any

const  loadConfig = (): any => {
    if(config) return config
    
    config = {}

    let env = process.env.NODE_ENV    
    if(env) env = env.toLowerCase()
    else {
        env = "local"
        console.log("NODE_ENV not informed, setted local")
    }

    return Object.assign(config, { env }, require(`./${env}`))
}

export {
    loadConfig,
    config
}

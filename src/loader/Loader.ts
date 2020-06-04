import subscribeConsumers from "../integration/amqp/Subscriber"

import startRestPresentation from "../presentation/rest/Server"

import { loadConfig } from "../config"

export default async (): Promise<void> => {
    const conf = loadConfig()
    console.log("**CONFIGS**", JSON.stringify(conf))

    await subscribeConsumers()
    await startRestPresentation()
}
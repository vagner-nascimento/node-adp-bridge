/*
    TODO: error after publish a lot of messages:

    error on publish into q-merchants Error: No channels left to allocate
    at Connection.C.freshChannel (/home/vagner/workspace/studies/node/node-enriching-adp/tests/node_modules/amqplib/lib/connection.js:451:11)
    at Channel.C.allocate (/home/vagner/workspace/studies/node/node-enriching-adp/tests/node_modules/amqplib/lib/channel.js:53:29)
    at tryCatcher (/home/vagner/workspace/studies/node/node-enriching-adp/tests/node_modules/bluebird/js/release/util.js:16:23)
    at Function.Promise.attempt.Promise.try (/home/vagner/workspace/studies/node/node-enriching-adp/tests/node_modules/bluebird/js/release/method.js:39:29)
    at Channel.C.open (/home/vagner/workspace/studies/node/node-enriching-adp/tests/node_modules/amqplib/lib/channel_model.js:68:21)
    at ChannelModel.CM.createChannel (/home/vagner/workspace/studies/node/node-enriching-adp/tests/node_modules/amqplib/lib/channel_model.js:48:12)
    at publish (/home/vagner/workspace/studies/node/node-enriching-adp/tests/stress.js:18:27)
    at pubMerchants (/home/vagner/workspace/studies/node/node-enriching-adp/tests/stress.js:47:19)

 */

const amqp = require("amqplib")

const merchantData = require("./support/mocks/merchant")
const sellerData = require("./support/mocks/seller")

const env = process.env.NODE_ENV ? process.env.NODE_ENV.toLocaleLowerCase() : "local"
const qtdSell = process.env.QTD_SELL ? Number(process.env.QTD_SELL) : 1500
const qtdMer = process.env.QTD_MERCH ? Number(process.env.QTD_MERCH) : 1500
const timeOutMs = process.env.MS_TIMEOUT ? Number(process.env.MS_TIMEOUT) : 120000

const connect = async () => {
    let connStr = env === "docker" ? "amqp://guest:guest@js-rabbit-mq:5672" : "amqp://guest:guest@localhost:5672"

    return await amqp.connect(connStr)
}

const publish = async (queue, data, conn) => {
    const ch = await conn.createChannel()

    ch.assertQueue(queue, { durable: false })
    ch.sendToQueue(queue, Buffer.from(data))
}

const pubSellers = async (conn) => {
    const qName = "q-sellers"

    for(let i = 1; i <= qtdSell; i++) {
        try {            
            await publish(qName, JSON.stringify(sellerData), conn)

            console.log(`${qName} - published  ${i} of ${qtdSell}`)
        } catch(err) {
            console.log(`error on publish into ${qName}`, err)
        }
    }

    return null
}

const pubMerchants = async (conn) => {
    const qName = "q-merchants"

    for(let i = 1; i <= qtdMer; i++) {
        try {
            await publish(qName, JSON.stringify(merchantData), conn)
            
            console.log(`${qName} - published  ${i} of ${qtdMer}`)
        } catch(err) {
            console.log(`error on publish into ${qName}`, err)
        }
    }

    return null
}

const start = async () => {
    const conn = await connect()
    console.log('successfully connected on amqp server')

    // TODO: realise why the last msg of last call is missing
    const selPromise = pubSellers(conn)
    const merPromise = pubMerchants(conn)

    await Promise.all([merPromise, selPromise])
        .then(() => console.log("all messages were published"))
        
    const start = new Date()
    const timeout = new Date(start.getTime() + timeOutMs)

    // TODO: implement msgs consuming to finish test
    console.log('start date', start)
    console.log('timeout date', timeout)
}

start()
    .then(() => {
        console.log('stress test finished')
        process.exit(0)
    })
    .catch(err => {
        console.log('error on process tets', JSON.stringify(err))
        process.exit(1)
    })
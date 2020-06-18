const amqp = require("amqplib")

const merchantData = require("./support/mocks/merchant")
const sellerData = require("./support/mocks/seller")

const env = process.env.NODE_ENV ? process.env.NODE_ENV.toLocaleLowerCase() : "local"
const qtdSell = process.env.QTD_SELL ? Number(process.env.QTD_SELL) : 100
const qtdMer = process.env.QTD_MERCH ? Number(process.env.QTD_MERCH) : 100
const timeOutMs = process.env.MS_TIMEOUT ? Number(process.env.MS_TIMEOUT) : 8000
/*
    2 minutes: 120000
    30 seconds: 30000
    15 seconds: 15000
*/

let msgProcessed = 0

const connect = async () => {
    let connStr = env === "docker" ? "amqp://guest:guest@js-rabbit-mq:5672" : "amqp://guest:guest@localhost:5672"

    return await amqp.connect(connStr)
}

const publish = async (queue, data, conn) => {
    const ch = await conn.createChannel()

    await ch.assertQueue(queue, { durable: false })
    await ch.sendToQueue(queue, Buffer.from(data))
    await ch.close()
}

const pubSellers = async conn => {
    const qName = "q-sellers"

    for(let i = 1; i <= qtdSell; i++) {
        try {
            await publish(qName, JSON.stringify(sellerData), conn)

            console.log(`${qName} - published  ${i} of ${qtdSell}`)
        } catch(err) {
            console.log(`error on publish into ${qName}`, err)

            throw err
        }
    }

    return null
}

const pubMerchants = async conn => {
    const qName = "q-merchants"

    for(let i = 1; i <= qtdMer; i++) {
        try {
            await publish(qName, JSON.stringify(merchantData), conn)
            
            console.log(`${qName} - published  ${i} of ${qtdMer}`)
        } catch(err) {
            console.log(`error on publish into ${qName}`, err)

            throw err
        }
    }

    return null
}

const consumeAccounts = async conn => {
    const ch = await conn.createChannel()
    
    const qAcc = "q-accounts"
    const msgHandler = async () => {
        msgProcessed++
        console.log(`event on - processed ${msgProcessed} messages`)
    }

    await ch.assertQueue(qAcc, { durable: false })
    await ch.consume(qAcc, msgHandler, { noAck: true })
    
    console.log(`listening queue ${qAcc}`)
}

const getTimeInMinutes = millis => {
    const minutes = Math.floor(millis / 60000)
    const seconds = ((millis % 60000) / 1000).toFixed(0)

    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds
}

const runWithConsume = async () => {
    const conn = await connect()
    console.log("successfully connected on amqp server")
    
    await consumeAccounts(conn)

    const startTime = new Date().getTime()
    const timeout = new Date(startTime + timeOutMs)

    const selPromise = pubSellers(conn)
    const merPromise = pubMerchants(conn)

    await Promise.all([merPromise, selPromise])
        .then(() => {
            console.log(`all ${qtdMer + qtdSell} messages were published`)
        })

    // TODO count doesn"t work, realise how to consume and count to automatize this test
    const totalSent = qtdSell + qtdMer
    let success = false

    while(new Date() <= timeout) {
        if(msgProcessed == totalSent) {
            success = true
            break
        }
    }

    if(success) {
        const duration = getTimeInMinutes(new Date().getTime() - startTime)
        console.log(`SUCCESS: STRESS TESTS COMPLETED IN ${duration}`)
    } else {
        console.log(`TEST FAILED, PROCESSED ${msgProcessed} OF ${totalSent} MESSAGES`)
    }
}

const runWithoutConsume = async () => {
    const conn = await connect()
    console.log("successfully connected on amqp server")

    const selPromise = pubSellers(conn)
    const merPromise = pubMerchants(conn)

    await Promise.all([merPromise, selPromise])
        .then(() => {
            console.log(`all ${qtdMer + qtdSell} messages were published`)
        })
}

const start = async () => {
    await runWithoutConsume()
}

start()
    .then(() => {
        console.log("stress test finished")
        process.exit(0)
    })
    .catch(err => {
        console.log("error on process test", JSON.stringify(err))
        process.exit(1)
    })

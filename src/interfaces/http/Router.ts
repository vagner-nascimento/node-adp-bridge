import { Router as newRouter } from "express"
import bodyParser from "body-parser"
import compression from "compression"
import methOveride from "method-override"

const healthChkRes = (req, res): void => {
    res.status(200).json({ status: "OK", checks: [] })
}

const apiRouter = newRouter()

apiRouter
    .use(methOveride('X-HTTP-Method-Override'))
    .use(bodyParser.json())
    .use(compression())
    .get('/live', healthChkRes)
    .get('/ready', healthChkRes)
    .get('/health', healthChkRes)

export default apiRouter

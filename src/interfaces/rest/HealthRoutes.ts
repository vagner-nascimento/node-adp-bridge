import { Router as newRouter } from "express"
import bodyParser from "body-parser"
import compression from "compression"
import methOveride from "method-override"

const healthRouter = newRouter()

const defaultRes = (req, res): void => {
    res.status(200).json({ status: "OK", checks: [] })
}

healthRouter.use(methOveride("X-HTTP-Method-Override"))
    .use(bodyParser.json())
    .use(compression())
    .get("/live", defaultRes)
    .get("/ready", defaultRes)
    .get("/health", defaultRes)

export default healthRouter

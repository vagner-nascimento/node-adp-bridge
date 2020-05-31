import { Router as newRouter } from "express"
import bodyParser from "body-parser"
import compression from "compression"
import methOveride from "method-override"

const router = newRouter()

const defaultRes = (req, res) => {
    res.status(200).json({ status: "OK", checks: [] })
}

router.use(methOveride("X-HTTP-Method-Override"))
    .use(bodyParser.json())
    .use(compression())
    .get("/live", defaultRes)
    .get("/ready", defaultRes)
    .get("/health", defaultRes)

export default router
import { config } from "../../config"

import logger from "../../infra/logger"

import newExpress from "express"

import healthRoutes from "./HealthRoutes"

export default (): Promise<any> => {
    const port = config.presentation.rest.port
    const express = newExpress()
    
    return new Promise((resolve, reject) => {
        express.use(healthRoutes)

        express.listen(port, err => {
            if (err) {
                logger.info("error on srtart rest server ", err)
                reject(err)
            }
    
            logger.info(`rest server is listening on port ${port}`)
            resolve()
        })
    })
}

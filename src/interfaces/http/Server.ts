import newExpress from 'express';

import config from '../../../config';

import logger from '../../infra/logging/Logger';

import router from './Router'

export function start(): Promise<any> {
    const express = newExpress();
    const { appPort: port } = config.info

    return new Promise((resolve, reject) => {
        express.use('/', router)

        express.listen(port, err => {
            if (err) {
                logger.info("HTTP server - error on srtart", err)
                reject(err)
            }
    
            logger.info(`HTTP server - listening on port ${port}`)
            resolve()
        })
    })
}

import httpStatus from "http-status"

import logger from "../../infra/logger"

import HttpClient from "../../infra/data/http/HttpClient"

import { isRequestFailed } from "./response/HttpResponse"

import Merchant from "../../app/entities/Merchant"

import { config } from "../../config"

class MerchantsClient extends HttpClient {
    constructor() {
        const {
            baseUrl,
            timeout
        } = config.integration.rest.merchants

        super({ baseUrl, timeout })
    }
    
    async getMerchant(merchant_id: string): Promise<Merchant> {
        const request = {
            url: `/${merchant_id}`,
            headers: {
                "Content-Type": "application/json"
            }
        }

        const defaultError =  new Error(`${this.getCallName(this.getMerchant)} - an erro occured on try to get the merchant`)

        try {
            const res = await super.get(request)

            if(res.status === httpStatus.NO_CONTENT) {
                logger.info(`${this.getCallName(this.getMerchant)} - returned ${res.status} without data`)

                return null
            }

            if(isRequestFailed(res.status)) {
                if(res.status === httpStatus.NOT_FOUND) return null

                throw defaultError
            }

            return new Merchant(res.data)
        } catch(err) {
            logger.info(`${this.getCallName(this.getMerchant)} - error `, err)

            throw defaultError
        }
    }

    private getCallName(fn: any): string {
        return `${this.constructor.name}.${fn.name}`
    }
}

export default new MerchantsClient()

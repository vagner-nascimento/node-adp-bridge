import httpStatus from "http-status"

import logger from "../../infra/logger"

import HttpClient from "../../infra/data/http/HttpClient"

import { isRequestFailed } from "./response/HttpResponse"

import Merchant from "../../app/entities/Merchant"

export default class MerchantsClient extends HttpClient {
    constructor({ baseUrl, timeout }) {
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
                const msg = `${this.getCallName(this.getMerchant)} - request failed with status ${res.status} and error `
                logger.info(msg, res.error)

                if(res.status === httpStatus.NOT_FOUND) return null

                throw defaultError
            }

            logger.info(`${this.getCallName(this.getMerchant)} - response data `, res.data)

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
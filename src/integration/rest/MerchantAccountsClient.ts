import httpStatus from "http-status"

import logger from "../../infra/logger"

import HttpClient from "../../infra/data/http/HttpClient"

import { isRequestFailed } from "./response/HttpResponse"

import MerchantAccount from "../../app/entities/MerchantAccount"

export default class MerchantAccountsClient extends HttpClient {
    constructor({ baseUrl, timeout }) {
        super({ baseUrl, timeout })
    }

    async getByMerchant(merchant_id: string): Promise<MerchantAccount[]> {
        const req = {
            params: { merchant_id },
            headers: {
                "Content-Type": "application/json"
            }
        }

        const defaultError =  new Error(`${this.getCallName(this.getByMerchant)} - an erro occured on try to get the merchant accounts`)

        try {
            const res = await super.get(req)
            if(res.status === httpStatus.NO_CONTENT) {
                logger.info(`${this.getCallName(this.getByMerchant)} - returned ${res.status} without data`)

                return []
            }

            if(isRequestFailed(res.status)) {
                const msg = `${this.getCallName(this.getByMerchant)} - request failed with status ${res.status} and error `
                logger.info(msg, res.error)

                if(res.status === httpStatus.NOT_FOUND) return []

                throw defaultError
            }

            logger.info(`${this.getCallName(this.getByMerchant)} - response data `, res.data)

            if(!Array.isArray(res.data)) throw new Error(`${this.getCallName(this.getByMerchant)} - unexpedted non array response`)

            return res.data.map(d => new MerchantAccount(d))
        } catch(err) {
            logger.info(`${this.getCallName(this.getByMerchant)} - error `, err)

            throw defaultError
        }
    }

    async getAccount(id: string): Promise<MerchantAccount> {
        const req = {
            url: `/${id}`,
            headers: {
                "Content-Type": "application/json"
            }
        }

        const defaultError =  new Error(`${this.getCallName(this.getAccount)} - an error occurred on try to get the merchant accounts`)

        try {
            const res = await super.get(req)
            if(res.status === httpStatus.NO_CONTENT) {
                logger.info(`${this.getCallName(this.getAccount)} - returned ${res.status} without data`)

                return null
            }

            if(isRequestFailed(res.status)) {
                const msg = `${this.getCallName(this.getAccount)} - request failed with status ${res.status} and error `
                logger.info(msg, res.error)

                if(res.status === httpStatus.NOT_FOUND) return null

                throw defaultError
            }

            logger.info(`${this.getCallName(this.getAccount)} - response data `, res.data)

            return new MerchantAccount(res.data)
        } catch(err) {
            logger.info(`${this.getCallName(this.getAccount)} - error `, err)

            throw defaultError
        }
    }

    private getCallName(fn: any): string {
        return `${this.constructor.name}.${fn.name}`
    }
}
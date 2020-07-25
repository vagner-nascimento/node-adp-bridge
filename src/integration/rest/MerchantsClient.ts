import httpStatus from "http-status"

import HttpClient from "../../infra/data/http/HttpClient"

import { isRequestFailed } from "./response/HttpResponse"

import Merchant from "../../app/entities/Merchant"

import { config } from "../../config"
import ApplicationError from '../../error/ApplicationError';

class MerchantsClient extends HttpClient {
    constructor() {
        const {
            baseUrl,
            timeout
        } = config.integration.rest.merchants

        super({ baseUrl, timeout }, MerchantsClient.name)
    }
    
    async getMerchant(merchant_id: string): Promise<Merchant> {
        const request = {
            url: `/${merchant_id}`,
            headers: {
                "Content-Type": "application/json"
            }
        }

        const errMsg = "an erro occured on try to get the merchant"

        try {
            const res = await super.get(request)

            if(res.status === httpStatus.NO_CONTENT) {
                this.logInfo(`get merchant returned ${res.status} without data`)

                return null
            }

            if(isRequestFailed(res.status)) {
                if(res.status === httpStatus.NOT_FOUND) return null

                this.logError(errMsg, res.error)

                throw new ApplicationError(errMsg)
            }

            return new Merchant(res.data)
        } catch(err) {
            this.logError(errMsg, err)

            throw new ApplicationError(errMsg)
        }
    }
}

export default new MerchantsClient()

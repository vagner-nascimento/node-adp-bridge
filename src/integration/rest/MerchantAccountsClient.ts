import httpStatus from "http-status"

import HttpClient from "../../infra/data/http/HttpClient"

import { isRequestFailed } from "./response/HttpResponse"

import MerchantAccount from "../../app/entities/MerchantAccount"

import { config } from "../../config"
import ApplicationError from '../../error/ApplicationError';

class MerchantAccountsClient extends HttpClient {
    constructor() {
        const {
            baseUrl,
            timeout
        } = config.integration.rest.merchantsAccounts

        super({ baseUrl, timeout }, MerchantAccountsClient.name)
    }

    async getByMerchant(merchant_id: string): Promise<MerchantAccount[]> {
        const req = {
            params: { merchant_id },
            headers: {
                "Content-Type": "application/json"
            }
        }

        const errMsg = `${this.getByMerchant.name} - an erro occured on try to get the merchant accounts`

        try {
            const res = await super.get(req)
            if(res.status === httpStatus.NO_CONTENT) {
                this.logInfo(`${this.getByMerchant.name} - get merchant accounts returned ${res.status} without data`)

                return []
            }

            if(isRequestFailed(res.status)) {
                if(res.status === httpStatus.NOT_FOUND) return []

                throw new ApplicationError(errMsg)
            }

            if(!Array.isArray(res.data)) throw new ApplicationError(`${this.getByMerchant.name} - unexpedted non array response`)

            return res.data.map(d => new MerchantAccount(d))
        } catch(err) {
            this.logError(errMsg, err)

            throw new ApplicationError(errMsg)
        }
    }

    async getAccount(id: string): Promise<MerchantAccount> {
        const req = {
            url: `/${id}`,
            headers: {
                "Content-Type": "application/json"
            }
        }

        const errMsg = `${this.getAccount.name} - an error occurred on try to get the merchant account`

        try {
            const res = await super.get(req)
            if(res.status === httpStatus.NO_CONTENT) {
                this.logInfo(`${this.getAccount.name} - returned ${res.status} without data`)

                return null
            }

            if(isRequestFailed(res.status)) {
                if(res.status === httpStatus.NOT_FOUND) return null

                this.logError(errMsg, res.error)

                throw new ApplicationError(errMsg)
            }

            return new MerchantAccount(res.data)
        } catch(err) {
            this.logError(errMsg, err)

            throw new ApplicationError(errMsg)
        }
    }
}

export default new MerchantAccountsClient()

import httpStatus from "http-status"

import logger from "../../infra/logger"

import HttpClient from "../../infra/data/http/HttpClient"

import { isRequestFailed } from "./response/HttpResponse"

import Affiliation from "../../app/entities/Affiliation"

import { config } from "../../config"

class AffiliationsClient extends HttpClient {
    constructor() {
        const {
            baseUrl,
            timeout
        } = config.integration.rest.affiliations

        super({ baseUrl, timeout })
    }

    async getByMerchant(merchant_id: string): Promise<Affiliation> {
        const req = {
            params: { merchant_id },
            headers: {
                "Content-Type": "application/json"
            }
        }

        const defaultError =  new Error(`${this.getCallName(this.getByMerchant)} - an error occurred on try to get the affiliation`)

        try {
            const res = await super.get(req)
            if(res.status === httpStatus.NO_CONTENT) {
                logger.info(`${this.getCallName(this.getByMerchant)} - returned ${res.status} without data`)

                return null
            }

            if(isRequestFailed(res.status)) {
                if(res.status === httpStatus.NOT_FOUND) return null

                throw defaultError
            }
            
            const affData = res.data[0]

            if(!affData) return null

            return new Affiliation(res.data[0])
        } catch(err) {
            throw defaultError
        }
    }

    private getCallName(fn: any): string {
        return `${this.constructor.name}.${fn.name}`
    }
}

export default new AffiliationsClient()

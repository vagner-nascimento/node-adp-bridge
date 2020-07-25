import httpStatus from "http-status"

import HttpClient from "../../infra/data/http/HttpClient"

import { isRequestFailed } from "./response/HttpResponse"

import Affiliation from "../../app/entities/Affiliation"

import { config } from "../../config"

import ApplicationError from '../../error/ApplicationError';

class AffiliationsClient extends HttpClient {
    constructor() {
        const {
            baseUrl,
            timeout
        } = config.integration.rest.affiliations

        super({ baseUrl, timeout }, AffiliationsClient.name)
    }

    async getByMerchant(merchant_id: string): Promise<Affiliation> {
        const req = {
            params: { merchant_id },
            headers: {
                "Content-Type": "application/json"
            }
        }

        const errMsg = "an error occurred on try to get the affiliation"

        try {
            const res = await super.get(req)
            if(res.status === httpStatus.NO_CONTENT) {
                this.logInfo(`get affiliation returned ${res.status} without data`)

                return null
            }

            if(isRequestFailed(res.status)) {
                if(res.status === httpStatus.NOT_FOUND) return null

                this.logError(errMsg, res.error)

                throw new ApplicationError(errMsg)
            }
            
            const affData = res.data[0]

            if(!affData) return null

            return new Affiliation(res.data[0])
        } catch(err) {
            this.logError(errMsg, err)

            throw new ApplicationError(errMsg)
        }
    }
}

export default new AffiliationsClient()

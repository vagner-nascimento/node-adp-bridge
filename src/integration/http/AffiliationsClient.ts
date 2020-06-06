import httpStatus from "http-status"

import HttpClient from "../../infra/data/http/HttpClient"

import { isRequestFailed } from "./response/HttpResponse"

import Affiliation from "../../app/entities/Affiliation"

export default class AffiliationsClient extends HttpClient {
    constructor({ baseUrl, timeout }) {
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
                console.log(`${this.getCallName(this.getByMerchant)} - returned ${res.status} without data`)

                return null
            }

            if(isRequestFailed(res.status)) {
                const msg = `${this.getCallName(this.getByMerchant)} - request failed with status ${res.status} and error `
                console.log(msg, res.error)

                if(res.status === httpStatus.NOT_FOUND) return null

                throw defaultError
            }

            console.log(`${this.getCallName(this.getByMerchant)} - response data `, res.data)

            return new Affiliation(res.data[0])
        } catch(err) {
            console.log(`${this.getCallName(this.getByMerchant)} - error `, err)

            throw defaultError
        }
    }

    private getCallName(fn: any): string {
        return `${this.constructor.name}.${fn.name}`
    }
}
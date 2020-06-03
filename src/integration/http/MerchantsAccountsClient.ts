import httpStatus from "http-status"

import HttpClient from '../../infra/data/http/HttpClient';

import { isRequestFailed } from "./response/HttpRespose"

import MerchantAccount from '../../app/entities/MerchantAccount';

export default class MerchantsAccountsClient extends HttpClient {
    constructor({baseUrl, timeout }) {
        super({ baseUrl, timeout })
    }

    async getByMerchant(merchant_id: string): Promise<MerchantAccount[]> {
        const req = {
            params: { merchant_id },
            headers: {
                "Content-Type": "application/json"
            }
        }

        const defaultError =  new Error(`${this.getCallName(this.getByMerchant)} - an erro occured on try to get the merchant`)

        try {
            const res = await super.get(req)
            if(res.status === httpStatus.NO_CONTENT) {
                console.log(`${this.getCallName(this.getByMerchant)} - returned ${res.status} without data`)

                return []
            }

            if(isRequestFailed(res.status)) {
                const msg = `${this.getCallName(this.getByMerchant)} - request failed with status ${res.status} and error `;
                console.log(msg, res.error)

                if(res.status === httpStatus.NOT_FOUND) return []

                throw defaultError
            }

            console.log(`${this.getCallName(this.getByMerchant)} - response data `, res.data)

            if(!Array.isArray(res.data)) throw new Error(`${this.getCallName(this.getByMerchant)} - unexpedted non array response`)

            return res.data.map(d => new MerchantAccount(d))
    } catch(err) {
        console.log(`${this.getCallName(this.getByMerchant)} - error `, err)

        throw defaultError
    }
    }

    private getCallName(method: any): string {
        return `${this.constructor.name}.${method.name}`
    }
}
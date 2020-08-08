import httpStatus from 'http-status'

import config from '../../../../config'

import Merchant from '../../../app/types/Merchant'

import ApplicationError from '../../../error/ApplicationError'

import HttpClient from '../HttpClient'
import { isRequestFailed } from '../HttpResponse'

class MerchantsClient extends HttpClient {
    constructor() {
        const {
            baseUrl,
            timeout
        } = config.integration.rest.merchants

        super({ baseUrl, timeout }, MerchantsClient.name)
    }

    public async getMerchant(id: string): Promise<Merchant> {
        const req = {
            url: `/${id}`,
            headers: {
                "Content-Type": "application/json"
            }
        }

        const errMsg = 'an error occurred on try to get Merchant'

        try {
            const res = await super.get(req)
            if(res.status === httpStatus.NO_CONTENT) {
                this.logInfo(`returned ${res.status} without data`, null, this.getMerchant.name)

                return null
            }

            if(isRequestFailed(res.status)) {
                if(res.status === httpStatus.NOT_FOUND) return null

                this.logError(errMsg, res.error, this.getMerchant.name)

                throw new ApplicationError(errMsg)
            }

            return new Merchant(res.data)
        } catch(err) {
            this.logError(errMsg, err, this.getMerchant.name)

            throw new ApplicationError(errMsg)
        }
    }
}

export default new MerchantsClient()

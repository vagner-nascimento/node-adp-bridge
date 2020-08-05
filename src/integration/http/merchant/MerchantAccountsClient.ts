import httpStatus from 'http-status'

import HttpClient from '../HttpClient'

import config from '../../../../config'

import MerchantAccount from '../../../app/types/MerchantAccount'

import { isRequestFailed } from '../HttpResponse'

import ApplicationError from '../../../error/ApplicationError'

class MerchantAccountsClient extends HttpClient {
    constructor() {
        const {
            baseUrl,
            timeout
        } = config.integration.rest.merchantsAccounts

        super({ baseUrl, timeout }, MerchantAccountsClient.name)
    }

    public async getAccount(id: string): Promise<MerchantAccount> {
        const req = {
            url: `/${id}`,
            headers: {
                "Content-Type": "application/json"
            }
        }

        const errMsg = 'an error occurred on try to get Merchant Account'

        try {
            const res = await super.get(req)
            if(res.status === httpStatus.NO_CONTENT) {
                this.logInfo(`returned ${res.status} without data`, null, this.getAccount.name)

                return null
            }

            if(isRequestFailed(res.status)) {
                if(res.status === httpStatus.NOT_FOUND) return null

                this.logError(errMsg, res.error, this.getAccount.name)

                throw new ApplicationError(errMsg)
            }

            return new MerchantAccount(res.data)
        } catch(err) {
            this.logError(errMsg, err, this.getAccount.name)

            throw new ApplicationError(errMsg)
        }
    }

    public async getByMerchant(merchant_id: string): Promise<MerchantAccount[]> {
        const req = {
            params: { merchant_id },
            headers: {
                "Content-Type": "application/json"
            }
        }

        const errMsg = 'an error occurred on try to get Merchant Accounts'

        try {
            const res = await super.get(req)
            if(res.status === httpStatus.NO_CONTENT) {
                this.logInfo(`returned ${res.status} without data`, null, this.getAccount.name)

                return []
            }

            if(isRequestFailed(res.status)) {
                if(res.status === httpStatus.NOT_FOUND) return null

                this.logError(errMsg, res.error, this.getAccount.name)

                throw new ApplicationError(errMsg)
            }

            if(!Array.isArray(res.data)) {
                this.logInfo('unexpected non array response: ', res.data, this.getByMerchant.name)

                throw new ApplicationError(errMsg)
            }

            return res.data.map(d => new MerchantAccount(d))
        } catch(err) {
            this.logError(errMsg, err, this.getAccount.name)

            throw new ApplicationError(errMsg)
        }
    }
}

export default new MerchantAccountsClient()

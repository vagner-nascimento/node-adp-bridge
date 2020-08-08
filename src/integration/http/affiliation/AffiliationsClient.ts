import httpStatus from 'http-status'

import config from '../../../../config'

import Affiliation from '../../../app/types/Affiliation'

import ApplicationError from '../../../error/ApplicationError'

import HttpClient from '../HttpClient'
import { isRequestFailed } from '../HttpResponse'

class AffiliationsClient extends HttpClient {
    constructor() {
        const {
            baseUrl,
            timeout
        } = config.integration.rest.affiliations

        super({ baseUrl, timeout }, AffiliationsClient.name)
    }

    public async getAffiliation(id: string): Promise<Affiliation> {
        const req = {
            url: `/${id}`,
            headers: {
                "Content-Type": "application/json"
            }
        }

        const errMsg = 'an error occurred on try to get Affiliation'

        try {
            const res = await super.get(req)
            if(res.status === httpStatus.NO_CONTENT) {
                this.logInfo(`returned ${res.status} without data`, null, this.getAffiliation.name)

                return null
            }

            if(isRequestFailed(res.status)) {
                if(res.status === httpStatus.NOT_FOUND) return null

                this.logError(errMsg, res.error, this.getAffiliation.name)

                throw new ApplicationError(errMsg)
            }

            return new Affiliation(res.data)
        } catch(err) {
            this.logError(errMsg, err, this.getAffiliation.name)

            throw new ApplicationError(errMsg)
        }
    }
}

export default new AffiliationsClient()

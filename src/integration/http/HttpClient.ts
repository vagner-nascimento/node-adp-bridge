import axios from 'axios'
import httpStatus from 'http-status'
import { Agent as HttpsAgent } from 'https'

import HttpMethod from './HttpMethod'

import Loggable from '../../infra/logging/Loggable'
import logger from '../../infra/logging'

export default abstract class HttpClient extends Loggable {
    constructor({ baseUrl: baseURL, timeout = 10000, rejectUnauthorized = false }, childClassName) {
        super(childClassName)

        this.axiosRequest = axios.create({
            baseURL,
            timeout,
            httpsAgent: new HttpsAgent({ rejectUnauthorized })
        })
    }

    private axiosRequest: any

    protected async get({ url = null, headers = null, params = null }): Promise<any> {
        return await this.doRequest(HttpMethod.GET, headers, url, params)
    }

    private async doRequest(
        method: HttpMethod,
        headers?: any,
        url?: string,
        params?: any,
        data?: any
    ): Promise<any> {
        try {
            return await this.axiosRequest({ method, headers, url, params, data })
        } catch(err) {
            let error = err
            let status = null

            if(err.isAxiosError)
                if(err.response) {
                     status = err.response.status
                     error = err.response
                }
                else status = httpStatus.SERVICE_UNAVAILABLE
            else
                status = httpStatus.INTERNAL_SERVER_ERROR

            logger.error(`${HttpClient.name} - error on call ${method} - ${this.getCompleteReqUrl(params, url)}`, error)

            return { error, status, data: null }
        }
    }

    private getCompleteReqUrl(params?: any, url?: string): string {
        return `${this.axiosRequest.defaults.baseURL}${url || "/"}` +
        `${params ? "/" + Object.entries(params).map(([k, v]) => `${k}=${v}`).join("&") : ""}`
    }
}

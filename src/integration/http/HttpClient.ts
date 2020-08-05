import axios from 'axios'
import httpStatus from 'http-status'
import { Agent as HttpsAgent } from 'https'

import HttpMethod from './HttpMethod'

import Loggable from '../../infra/logging/Loggable'
import logger from '../../infra/logging/Logger'

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
        headers: any = null,
        url: string = null,
        params: any = null,
        data: any = null
    ): Promise<any> {
        try {
            return await this.axiosRequest({ method, headers, url, params, data })
        } catch(error) {
            const completeUrl = `${this.axiosRequest.defaults.baseURL}${url || ""}` +
                `${params ? "/" + Object.entries(params).map(([k, v]) => `${k}=${v}`).join("&") : ""}`

            logger.error(`HttpClient - error on call ${method} - ${completeUrl}: `, error)

            let status = null

            if(error.isAxiosError)
                if(error.response) status = error.response.status
                else status = httpStatus.SERVICE_UNAVAILABLE
            else
                status = httpStatus.INTERNAL_SERVER_ERROR            

            return { error, status, data: null }
        }
    }
}

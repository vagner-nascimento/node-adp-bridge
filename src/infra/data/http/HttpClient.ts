import axios from "axios"
import httpStatus from "http-status"
import logger from "../../logger"

export default abstract class HttpClient {
    constructor({ baseUrl, timeout = 10000 }) {
        this.instance = axios.create({
            baseURL: baseUrl,
            timeout
        })
    }

    private instance: any

    protected async get({ url = null, headers = null, params = null }): Promise<any> {
        return this.performRequest("get", headers, url, params)
    }

    private async performRequest(
        method: string,
        headers: any = null,
        url: string = null,
        params: any = null,
        data: any = null
    ): Promise<any> {
        const completeUrl = `${this.instance.defaults.baseURL}${url || ""}${params ? "/" + Object.entries(params).map(([k, v]) => `${k}=${v}`).join("&") : ""}`

        try {
            const res = await this.instance({ method, headers, url, params, data })
            
            logger.info(`Http ${method} - the cal to the ${completeUrl} retutned status ${res.status} and response data: `, res.data)

            return res
        } catch(error) {
            let status = null
            
            if(error.isAxiosError) {
                if(error.response) status = error.response.status
                else status = httpStatus.SERVICE_UNAVAILABLE
            } else {
                status = httpStatus.INTERNAL_SERVER_ERROR
            }

            logger.error(`Http ${method} - error with status ${status} on call ${completeUrl}. error: `, error.message)

            return { error, status, data: null }
        }
    }
}

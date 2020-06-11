import axios from "axios"
import httpStatus from "http-status"

export default class HttpClient {
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
        try {
            return await this.instance({ method, headers, url, params, data })
        } catch(error) {
            if(error.isAxiosError) {
                if(error.response)
                    return { error, status: error.response.status, data: null }

                return { error, status: httpStatus.SERVICE_UNAVAILABLE, data: null }
            }

            return { error, status: httpStatus.INTERNAL_SERVER_ERROR, data: null }
        }
    }
}
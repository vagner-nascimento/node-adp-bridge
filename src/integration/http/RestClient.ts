import axios from "axios"

export default class RestClient {
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
        } catch(err) {
            // TODO realise how to handle this error
            if(err.isAxiosError) return { error: err, status: err.response.status}
            return err.response || err.request
        }
    }
}
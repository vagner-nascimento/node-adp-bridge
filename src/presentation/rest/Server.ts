import newExpress from "express"
import healthRoutes from "./HealthRoutes"

export default (): Promise<any> => {
    const port = 3000 // TODO get port from env configs
    const express = newExpress()
    
    return new Promise((resolve, reject) => {
        express.use(healthRoutes)

        express.listen(port, err => {
            if (err) {
                console.log('error on srtart rest server ', err)
                reject(err)
            }
    
            console.log(`rest server is listening on port ${port}`)
            resolve()
        })
    })
}
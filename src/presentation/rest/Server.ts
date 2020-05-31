import newExpress from "express"
import healthRoutes from "./HealthRoutes"

export default () => {
    const port = 3000 // TODO get port from env configs
    const express = newExpress()
    
    express.use(healthRoutes)
    express.listen(port, err => {
        if (err) {
            return err
        }

        return console.log(`rest server is listening on port ${port}`)
    })
}
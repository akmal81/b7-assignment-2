import app from "./app"
import config from "./config/env"
import initDB from "./db/schema"


const server = () => {
    // database schema
    initDB()

    app.listen(config.prot, () => {
        console.log(`DevPulse app listening on port ${config.prot}`)
    })

}

server()
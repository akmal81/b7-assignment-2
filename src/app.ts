import express from "express";
import { IndexRoutes } from "./router";
const app = express();

app.use(express.json())


app.get('/', (req, res) => {

    res.send('Welcom to DevPulse App')
})

app.use('/api', IndexRoutes)

export default app
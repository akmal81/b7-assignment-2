import express from "express";
import { IndexRoutes } from "./router";
import { globalErrorHandler } from "./errorHandller/globalErrorHandler";
const app = express();

app.use(express.json())


app.get('/', (req, res) => {

    res.send('Welcom to DevPulse App')
})

app.use('/api', IndexRoutes)


app.use(globalErrorHandler);

export default app
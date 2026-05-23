import express from "express";
import { IndexRoutes } from "./router";
import { globalErrorHandler } from "./errorHandler/globalErrorHandler";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors(
    {
        origin: "http://localhost:3000"
    }
))


app.get('/', (req, res) => {

    res.send('Welcom to DevPulse App')
})

app.use('/api', IndexRoutes)


app.use(globalErrorHandler);

export default app
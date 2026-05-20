import express from "express";
const app = express();

app.use(express.json())


app.get('/', (req, res) => {
    
    res.send('Welcom to DevPulse App')
})

export default app
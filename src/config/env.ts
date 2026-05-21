import dotenv from "dotenv";
import path from "path"


dotenv.config(
    {
        path: path.join(process.cwd(), '.env')
    }
);

const config = {
    prot: process.env.PORT,
    connStr:process.env.CONNECTION_STRING,
    secret:process.env.JWT_SECRET
};


export default config;
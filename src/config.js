import {config} from "dotenv";
config();

const serverConfig = {
    PORT: process.env.PORT || 5000,
    DB_NAME: process.env.DB_NAME,
    DbUri: process.env.DbUri,
    SERVERSELECTIONTIMEOUT: process.env.SERVERSELECTIONTIMEOUT,
    EMAIL: process.env.EMAIL,
    NODE_MAILER: process.env.NODE_MAILER,
    MY_ACCESS_TOKEN_KEY: process.env.MY_ACCESS_TOKEN_KEY,
    MY_REFRESH_TOKEN_KEY: process.env.MY_REFRESH_TOKEN_KEY,
    NODE_ENV: process.env.NODE_ENV,
    CLOUD_NAME: process.env.CLOUD_NAME,
    API_KEY: process.env.API_KEY,
    API_SECRET:process.env.API_SECRET
}

export default serverConfig
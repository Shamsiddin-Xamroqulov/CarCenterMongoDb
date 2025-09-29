import express from "express";
import mongoose from "mongoose";
import cors from "cors"
import cookieParser from "cookie-parser";
import serverConfig from "./config.js";
import mainRouter from "./routes/main.routes.js";
const {PORT, SERVERSELECTIONTIMEOUT, DbUri, DB_NAME} = serverConfig;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true
}))

app.use("/api", mainRouter);

async function bootstrap () {
    try {
        const createDataBase = await mongoose.connect(DbUri, {
            dbName: DB_NAME,
            serverSelectionTimeoutMS: SERVERSELECTIONTIMEOUT
        })
        app.listen(PORT, () => {
            console.log(`Server is running on http://127.0.0.1:${PORT}`);
        })
    }catch(err) {
        console.log("DB error", err.message)
    }
}

bootstrap();
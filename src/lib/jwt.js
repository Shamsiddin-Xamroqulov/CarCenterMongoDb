import jwt from "jsonwebtoken";
import {config} from "dotenv"
config();
import serverConfig from "../config.js";
const {MY_ACCESS_TOKEN_KEY, MY_REFRESH_TOKEN_KEY} = serverConfig

const JwtConfig = {
    createAccessToken: (payload) => jwt.sign(payload, MY_ACCESS_TOKEN_KEY, {expiresIn: "5s"}),
    verifyAccessToken: (token) => jwt.verify(token, MY_ACCESS_TOKEN_KEY),
    createRefreshToken: (payload) => jwt.sign(payload, MY_REFRESH_TOKEN_KEY, {expiresIn: "30d"}),
    verifyRefreshToken: (token) => jwt.verify(token, MY_REFRESH_TOKEN_KEY)
}

export default JwtConfig;
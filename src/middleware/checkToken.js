import { ClientError, globalError } from "shokhijakhon-error-handler";
import JwtConfig from "../lib/jwt.js";
import User from "../model/User.js";

const checkToken = async (req, res, next) => {
    try {
        const token = req.headers.token;
        if(!token) throw new ClientError("Unauthorized", 401);
        const verifyTn = JwtConfig.verifyAccessToken(token);
        const checkUser = await User.findById(verifyTn.user_id);
        if(!checkUser) throw new ClientError("Invalid Token !", 401);
        req.admin = checkUser.role === "admin";
        req.role = checkUser.role;
        req.user = checkUser;
        return next()
    }catch(err) {
        if(err.name == "TokenExpiredError") {
            return res.status(401).json({
                code: "TOKEN_EXPIRED",
                status: 401
            })
        }
        return globalError(err, res);
    }
}

export default checkToken
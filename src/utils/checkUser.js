import { ClientError } from "shokhijakhon-error-handler";
import JwtConfig from "../lib/jwt.js";

const checkUser = async (token, userId) => {
  if (!token) throw new ClientError("Token is required", 400);
  let decoded;
  try {
    decoded = JwtConfig.verifyAccessToken(token);
  } catch (err) {
    throw new ClientError("Invalid token", 401);
  }

  if (!decoded) throw new ClientError("Token not found", 404);

  if (decoded.user_id !== userId) {
    throw new ClientError(
      "You are not authorized to access this resource",
      403
    );
  }
  return true;
};

export default checkUser;

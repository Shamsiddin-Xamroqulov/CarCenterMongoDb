import {Router} from "express";
import authController from "../controller/auth.controller.js";
import uploadAvatar from "../middleware/avatar.upload.js"

const authRouter = Router();

authRouter.post("/register", uploadAvatar.single("avatar"), authController.REGISTER);
authRouter.post("/login", authController.LOGIN);

authRouter.post("/verify", authController.VERIFY);
authRouter.post("/resend/otp", authController.RESEND_OTP);
authRouter.post("/forgot/password", authController.FORGOT_PASSWORD);
authRouter.post("/change/password", authController.CHANGE_PASSWORD);
authRouter.get("/refresh/token", authController.REFRESH_TOKEN);

authRouter.post("/logout", authController.LOG_OUT);

export default authRouter;
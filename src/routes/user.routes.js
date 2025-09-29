import {Router} from "express";
import userController from "../controller/user.controller.js";
import checkToken from "../middleware/checkToken.js";
import uploadAvatar from "../middleware/avatar.upload.js";

const userRouter = Router();

userRouter.get("/get/all", userController.GET_ALL);
userRouter.get("/get/:id", userController.GET_USER_BY_ID);
userRouter.post("/create", checkToken, userController.CREATE_USER);
userRouter.put("/update/:id", checkToken, uploadAvatar.single("avatar"), userController.UPDATE_USER);
userRouter.delete("/delete/:id", checkToken, userController.DELETE_USER);

export default userRouter;
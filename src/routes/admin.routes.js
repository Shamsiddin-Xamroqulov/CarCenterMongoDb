import {Router} from "express";
import adminController from "../controller/admin.controller.js";
import checkToken from "../middleware/checkToken.js";
import uploadAvatar from "../middleware/avatar.upload.js"

const adminRouter = Router();

adminRouter.get("/get/all", checkToken, adminController.GET_ALL);
adminRouter.get("/get/:id", checkToken, adminController.GET_ADMIN_BY_ID);
adminRouter.post("/create", checkToken, adminController.CREATE_ADMIN);
adminRouter.put("/update/:id", checkToken, uploadAvatar.single("avatar"), adminController.UPDATE_ADMIN);
adminRouter.delete("/delete/:id", checkToken, adminController.DELETE_ADMIN);

export default adminRouter;
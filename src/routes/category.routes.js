import {Router} from "express";
import categoryController from "../controller/category.controller.js";
import checkToken from "../middleware/checkToken.js";
import uploadCategory from "../middleware/category.upload.js";

const categoryRouter = Router();

categoryRouter.get("/get/all", categoryController.GET_ALL);
categoryRouter.get("/get/:id", categoryController.GET_CATEGORY_BY_ID);
categoryRouter.post("/create", checkToken, uploadCategory.single('logo'), categoryController.CREATE_CATEGORY);
categoryRouter.put("/update/:id", checkToken, uploadCategory.single('logo'), categoryController.UPDATE_CATEGORY);
categoryRouter.delete("/delete/:id", checkToken, categoryController.DELETE_CATEGORY);

export default categoryRouter;
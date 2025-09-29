import {Router} from "express";
import carController from "../controller/car.controller.js";
import checkToken from "../middleware/checkToken.js";
import upload from "../middleware/uploads.js";

const carRouter = Router();

carRouter.get("/get/all", carController.GET_ALL);
carRouter.get("/get/:id", carController.GET_CAR_BY_ID);
carRouter.post("/create", checkToken, upload.single("photo"), carController.CREATE_CAR);
carRouter.put("/update/:id", checkToken, upload.single("photo"), carController.UPDATE_CAR);
carRouter.delete("/delete/:id", checkToken, carController.DELETE_CAR);

export default carRouter
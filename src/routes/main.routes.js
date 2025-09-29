import {Router} from "express";
import authRouter from "./auth.routes.js";
import carRouter from "./car.routes.js";
import categoryRouter from "./category.routes.js";
import userRouter from "./user.routes.js";
import adminRouter from "./admin.routes.js";

const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/car", carRouter);
mainRouter.use("/category", categoryRouter);
mainRouter.use("/user", userRouter);
mainRouter.use("/admin", adminRouter);

export default mainRouter;
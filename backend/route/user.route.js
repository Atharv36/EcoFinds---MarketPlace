import { Router } from "express";
import { registerUserController, loginUserController } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.post("/login", loginUserController);

export default userRouter;

import { Router } from "express";
import { validateData } from "../middlewares";
import { userLoginSchema } from "../schemas";
import authController from "../controllers/auth.controller";

const router = Router();

router.post("/login");

export default router;

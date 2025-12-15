import { Router } from "express";
import { validateData } from "../../middlewares";
import { userLoginSchema } from "../../schemas";
import basicController from "../../controllers/auth/basic.controller";

const router = Router();

router.post("/login", validateData(userLoginSchema), basicController.login);

export default router;

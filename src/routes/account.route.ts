import { Router } from "express";
import ctl from "../controllers/account.controller";
import { validateData } from "../middlewares";
import { RegistrationSchema } from "../schemas";

const router = Router();

router.post("/", validateData(RegistrationSchema), ctl.createAccount);

export default router;

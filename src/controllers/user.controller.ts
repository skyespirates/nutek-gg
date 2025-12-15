import { Request, Response } from "express";
import { success, failure } from "../utils/response";
import bcrypt from "bcrypt";
import userService from "../services/user.service";
import logger from "../utils/logger";

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS!, 10);

async function register(req: Request, res: Response) {
  const { username, email, password } = req.body;

  try {
    const hashed_password = await bcrypt.hash(password, saltRounds);
    const created = await userService.create(username, email, hashed_password);
    success(res, 201, "registered successfully", null);
  } catch (error) {
    logger.error(error);
    failure(res, "failed to register", 500);
  }
}

export default {
  register,
};

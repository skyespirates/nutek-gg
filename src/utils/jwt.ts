import jwt from "jsonwebtoken";
import { TokenPayload } from "../types";
import { env } from "../configs/env";

function generateToken(payload: TokenPayload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRED_IN });
}

export default {
  generateToken,
};

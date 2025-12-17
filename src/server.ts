import "dotenv/config";
import express, { Request, Response } from "express";
import logger from "./utils/logger";
import {
  authenticate,
  errorHandler,
  logging,
  validateData,
} from "./middlewares";
import { JwtPayload } from "jsonwebtoken";
import multer from "multer";

import asyncHandler from "express-async-handler";

// routes
import { TokenPayload } from "./types";
import accountController from "./controllers/account.controller";
import {
  RegistrationSchema,
  paymentSchema,
  topupSchema,
  updateProfileSchema,
  userLoginSchema,
} from "./schemas";
import path from "path";
import serviceController from "./controllers/service.controller";
import bannerController from "./controllers/banner.controller";
import transactionController from "./controllers/transaction.controller";
import authController from "./controllers/auth.controller";
import { HttpError } from "./utils/http-error";

const publicDir = path.join(__dirname, "public");
const uploadDir = path.join(__dirname, "uploads");

const allowedMimeTypes = ["image/jpeg", "image/png"];
const allowedExtensions = [".jpg", ".jpeg", ".png"];

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;

    if (allowedMimeTypes.includes(mime) && allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new HttpError(400, "Format image tidak sesuai"));
    }
  },
});

const app = express();
const port = process.env.PORT || 8080;

app.set("trust proxy", true);

app.use(logging);
app.use(express.json());

app.use(express.static(publicDir));
app.use(express.static(uploadDir));

app.post(
  "/login",
  validateData(userLoginSchema),
  asyncHandler(authController.login)
);

app.post(
  "/registration",
  validateData(RegistrationSchema),
  asyncHandler(accountController.createAccount)
);

app.get("/profile", authenticate, asyncHandler(accountController.getProfile));

app.put(
  "/profile/update",
  authenticate,
  validateData(updateProfileSchema),
  asyncHandler(accountController.updateProfile)
);

app.put(
  "/profile/image",
  authenticate,
  upload.single("file"),
  asyncHandler(accountController.uploadProfileImage)
);

app.get("/banners", asyncHandler(bannerController.list));

app.get("/services", authenticate, asyncHandler(serviceController.list));

app.get(
  "/get-balance",
  authenticate,
  asyncHandler(accountController.getBalance)
);

app.post(
  "/topup",
  authenticate,
  validateData(topupSchema),
  asyncHandler(accountController.topup)
);

app.post(
  "/transaction",
  authenticate,
  validateData(paymentSchema),
  asyncHandler(accountController.payment)
);

app.get(
  "/transaction/history",
  authenticate,
  validateData(paymentSchema),
  asyncHandler(transactionController.list)
);

app.all("*", (req, res) => {
  res.status(404).sendFile(path.join(publicDir, "404.html"));
});

app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server is running on ${port}`);
});

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload | JwtPayload;
    }
  }
}

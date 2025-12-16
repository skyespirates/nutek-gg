import "dotenv/config";
import express, {
  NextFunction,
  Request,
  Response,
  ErrorRequestHandler,
} from "express";
import logger from "./utils/logger";
import {
  authenticateJWT,
  errorHandler,
  logging,
  validateData,
} from "./middlewares";
import { JwtPayload } from "jsonwebtoken";
import multer from "multer";

import asyncHandler from "express-async-handler";

// routes
import authRoutes from "./routes/auth";
import runnerRoutes from "./routes/runner.route";
import requestRoutes from "./routes/request.route";
import protectedRoutes from "./routes/protected.route";
import accountRoutes from "./routes/account.route";
import transferRoutes from "./routes/transfer.route";
import { failure } from "./utils/response";
import { TokenPayload } from "./types";
import accountController from "./controllers/account.controller";
import { topupSchema, updateProfileSchema } from "./schemas";
import path from "path";
import serviceController from "./controllers/service.controller";
import bannerController from "./controllers/banner.controller";

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
      cb(new Error("Only JPEG and PNG images are allowed"));
    }
  },
});

const app = express();
const port = process.env.PORT || 8080;

app.use(logging);
app.use(express.json());

app.use(express.static(uploadDir));

// #1 autentikasi dengan 2 metode login, basic dan otp
app.use("/auth", authRoutes);

// #2 running number
app.use("/runner", runnerRoutes);

app.use("/registration", accountRoutes);

app.get("/profile", authenticateJWT, accountController.getProfile);

app.put(
  "/profile/update",
  authenticateJWT,
  validateData(updateProfileSchema),
  accountController.updateProfile
);

app.put(
  "/profile/image",
  authenticateJWT,
  upload.single("file"),
  accountController.uploadProfileImage
);

app.get("/banners", authenticateJWT, asyncHandler(bannerController.list));

app.get("/services", authenticateJWT, asyncHandler(serviceController.list));

app.get(
  "/get-balance",
  authenticateJWT,
  asyncHandler(accountController.getBalance)
);

app.post(
  "/topup",
  authenticateJWT,
  validateData(topupSchema),
  accountController.topup
);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload | JwtPayload;
    }
  }
}

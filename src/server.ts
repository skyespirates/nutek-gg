import "dotenv/config";
import express, { Request, Response } from "express";
import logger from "./utils/logger";
import { authenticateJWT, logging, validateData } from "./middlewares";
import { JwtPayload } from "jsonwebtoken";

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
import { topupSchema } from "./schemas";

const app = express();
const port = process.env.PORT || 8080;

app.use(logging);
app.use(express.json());

// #1 autentikasi dengan 2 metode login, basic dan otp
app.use("/auth", authRoutes);

// #2 running number
app.use("/runner", runnerRoutes);

// #6 endpoint dengan lebih dari 2 query
app.use("/transfer", transferRoutes);

app.use("/registration", accountRoutes);

app.get("/get-balance", authenticateJWT, accountController.getBalance);
app.post(
  "/topup",
  authenticateJWT,
  validateData(topupSchema),
  accountController.topup
);

// #7 data laporan jumlah request user per jam
app.use("/rph", requestRoutes);

app.use("/protected", authenticateJWT, protectedRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

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

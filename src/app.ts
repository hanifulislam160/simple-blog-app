import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "./lib/prisma";
import config from "./config/index";
import httpStatus from "http-status";
import { userRoutes } from "./modules/user/user.route";
import { authRoutes } from "./modules/auth/auth.route";

const app: Application = express();

app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});

// Register
app.use("/api/user", userRoutes);
// login
app.use("/api/user", authRoutes);

// Login
app.post("/api/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res
      .status(httpStatus.NOT_FOUND)
      .json({ success: false, message: "User not found" });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res
      .status(httpStatus.UNAUTHORIZED)
      .json({ success: false, message: "Invalid credentials" });
    return;
  }

  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt_access_token as string,
    { expiresIn: "1d" },
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    config.jwt_refresh_token as string,
    { expiresIn: "7d" },
  );

  res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false });
  res.json({ success: true, accessToken });
});

export default app;

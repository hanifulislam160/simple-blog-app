import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "./lib/prisma";
import config from "./config/index";
import httpStatus  from "http-status";

const app: Application = express();

app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Register
app.post("/api/auth/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds) || 10
  );

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  res.status(httpStatus.CREATED).json({ success: true, data: { id: user.id, email: user.email } });
});

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
    res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "Invalid credentials" });
    return;
  }

  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt_access_token as string,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    config.jwt_refresh_token as string,
    { expiresIn: "7d" }
  );

  res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false });
  res.json({ success: true, accessToken });
});

export default app;

import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import httpStatus from 'http-status';
import bcrypt from "bcryptjs";
import config from "../../config";

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, profilePhoto } = req.body;

  const isExitUser = await prisma.user.findUnique({ where: { email } });

  if (isExitUser) {
    res
      .status(httpStatus.CONFLICT)
      .json({ success: false, message: "User already exists" });
    return;
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds) || 10,
  );

  const createdUser = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  await prisma.profile.create({
    data: { userId: createdUser.id, profilePhoto },
  });

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "User created successfully",
    statusCode: httpStatus.CREATED,
    data: { user: createdUser },
  });
};

export const userController = {
  registerUser,
};
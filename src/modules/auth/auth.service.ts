import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { LoginUserPayload } from "./auth.interface";



const loginUser = async (payload: LoginUserPayload) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error("Password does not match");
  }

  const jtwPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jtwPayload,
    config.jwt_access_token as string,
    config.jwt_access_token_expire_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jtwPayload,
    config.jwt_refresh_token as string,
    config.jwt_refresh_token_expire_in as SignOptions,
  );

  return { accessToken, refreshToken };
};

export const authServices = {
  loginUser,
};

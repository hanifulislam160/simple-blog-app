import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { UserFindUniqueOrThrowArgs } from "./../../../generated/prisma/models/User";

type LoginUserPayload = {
  email: string;
  password: string;
};

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
  return user;
};

export const authServices = {
  loginUser,
};

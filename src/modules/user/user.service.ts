import bcrypt from "bcryptjs";
import config from "../../config";
import { prisma } from "../../lib/prisma";
// import  httpStatus  from "http-status";
import { RegisterUserPayload } from "./user.interface";


const registerIntoDB = async (payload: RegisterUserPayload) => {
  const { name, email, password, profilePhoto } = payload;

  const isExitUser = await prisma.user.findUnique({ where: { email } });

  if (isExitUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds) || 10,
  );

  const createdUser = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

   await prisma.profile.create({
     data: {
       userId: createdUser.id,
       profilePhoto,
     },
   });

  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email || email,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });


  return user;
};


const getUserProfileFromDb = async() =>{
  
}

export const userServices = {
  registerIntoDB,
  getUserProfileFromDb,
};

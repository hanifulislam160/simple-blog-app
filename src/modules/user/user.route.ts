import httpStatus from "http-status";
import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
const router = Router();

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        name: string;
        role: Role;
        id: string;
      };
    }
  }
}

// signup
router.post("/register", userController.registerUser);

const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async( req: Request, res: Response, next: NextFunction) => {
    const token= req.cookies.accessToken ? req.cookies.accessToken :  req.headers.authorization?.startsWith('Bearer') ? 
    req.headers.authorization?.split(" ")[1] : req.headers.authorization;

    if(!token){
     throw new Error("unauthorized, you are not logged in");
    }

    const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_token);

    if(!verifiedToken.success){
      throw new Error(verifiedToken.error);
    }

    const { email, name, role, id } = verifiedToken.data as JwtPayload;

    if (requiredRoles.length && !requiredRoles.includes(role as Role)) {
      throw new Error("Forbidden Access, You don't have permission to access this resource");
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id,
        email,
      },
    });

    if(!user){
      throw new Error("User not found, Please login again");
    }

    if(user.activeStatus === "BLOCKED"){
      throw new Error("User is blocked, Please contact support");
    }

    req.user = { email, name, role, id };

    next();
  });
};

router.get(
  "/me",
  auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  // (req: Request, res: Response, next: NextFunction) => {
  //   // console.log(req.cookies);
  //   const { accessToken } = req.cookies;

  //   const verifiedToken = jwtUtils.verifyToken(
  //     accessToken,
  //     config.jwt_access_token,
  //   );

  //   if (!verifiedToken.success) {
  //     throw new Error(verifiedToken.error);
  //   }

    

  //   // const requiredRoles = ["ADMIN", "USER", "AUTHOR"];
  //   const requiredRoles = [Role.ADMIN, Role.USER, Role.AUTHOR];

   

  //   const { email, name, role, id } = verifiedToken.data as JwtPayload;

  //   if (!requiredRoles.includes(role as Role)) {
  //     return res.status(httpStatus.FORBIDDEN).json({
  //       success: false,
  //       statusCode: 403,
  //       message:
  //         "Forbidden Access, You don't have permission to access this resource",
  //     });
  //   }

  //   req.user = { email, name, role, id };

  //   next();
  // },
  userController.getMyProfile,
);

export const userRoutes = router;

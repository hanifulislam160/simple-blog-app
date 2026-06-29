import httpStatus from "http-status";
import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { auth } from "../../middlewares/auth";
const router = Router();

// signup
router.post("/register", userController.registerUser);

router.get(
  "/me",
  auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  userController.getMyProfile,
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
);

router.put(
  "/my-profile",
  auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  userController.updateMyProfile,
);

export const userRoutes = router;

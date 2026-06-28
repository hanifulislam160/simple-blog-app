import httpStatus from "http-status";
import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";
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
router.get(
  "/me",
  (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.cookies);
    const { accessToken } = req.cookies;

    const verifiedToken = jwtUtils.verifyToken(
      accessToken,
      config.jwt_access_token,
    );

    // const requiredRoles = ["ADMIN", "USER", "AUTHOR"];
    const requiredRoles = [Role.ADMIN, Role.USER, Role.AUTHOR];

    if (typeof verifiedToken === "string") {
      throw new Error("Invalid token");
    }

    const { email, name, role, id } = verifiedToken;

    if (!requiredRoles.includes(role as Role)) {
      return res.status(httpStatus.FORBIDDEN).json({
        success: false,
        statusCode: 403,
        message:
              "Forbidden Access, You don't have permission to access this resource",
        
      });
    }
      
    req.user = { email, name, role, id };

    next();
  },
  userController.getMyProfile,
);

export const userRoutes = router;

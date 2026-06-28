import jwt  from 'jsonwebtoken';
import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { userServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import config from '../../config';
import { jwtUtils } from '../../utils/jwt';

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const user = await userServices.registerIntoDB(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User created successfully",
    data: user,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  
  const { accessToken } = req.cookies;
  const verificationToken = jwtUtils.verifyToken(accessToken, config.jwt_access_token);

  if(typeof verificationToken === 'string'){
    throw new Error("Invalid token");
  }

  const profile = await userServices.getUserProfileFromDb(verificationToken.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile retrieved successfully",
    data: profile,
  });
});

export const userController = {
  registerUser,
  getMyProfile,
};


import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { userServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";


const registerUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const user = await userServices.registerIntoDB(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User created successfully",
    data: user,
  })
  
});

const getMyProfile = catchAsync(async(req:Request, res:Response)=>{
  const token = req.cookies.refreshToken;
  console.log(token);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile retrieved successfully",
    data: {},
  })

})

export const userController = {
  registerUser,
  getMyProfile,
};

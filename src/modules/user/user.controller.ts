import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { userServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const user = await userServices.registerIntoDB(payload);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "User created successfully",
    statusCode: httpStatus.CREATED,
    data: { user },
  });
});


export const userController = {
  registerUser,
};

import { Request, Response } from "express";
import httpStatus from "http-status";
import { userServices } from "./user.service";

const registerUser = async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    const user = await userServices.registerIntoDB(payload);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "User created successfully",
      statusCode: httpStatus.CREATED,
      data: { user },
    });
  } catch (error:any) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message:"Failed to register User",
      error: error.message
    });
  }
};

export const userController = {
  registerUser,
};

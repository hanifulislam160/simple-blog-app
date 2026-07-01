import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postServices } from "./post.service";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";

const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const userId = req.user?.id;
    const result = await postServices.createPost(payload, userId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Post created successfully",
      data: result,
    });
  },
);

const getAllPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postServices.getAllpostFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Posts fetched successfully",
      data: result,
    });
  },
);

const getPostById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    console.log("id", id);
    const result = await postServices.getPostByIdFromDB(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post fetched successfully",
      data: result,
    });
  },
);

const getMyPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const result = await postServices.getMyPostsFromDB(userId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "My posts fetched successfully",
      data: result,
    });
  },
);

export const postController = {
  createPost,
  getAllPost,
  getPostById,
  getMyPosts,
};

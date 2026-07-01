import { prisma } from "../../lib/prisma";
import { ICreatePostPayload } from "./post.interface";

const createPost = async (payload: ICreatePostPayload, userId: string) => {
  const post = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return post;
};

const getAllpostFromDB = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      comments: true,
    },
  });

  return posts;
};

const getPostByIdFromDB = async (postId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  const updatePost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
    include: {
      author: {
        omit: {
          password: true,
        }
      },
      comments: true,
    }

  });

  return updatePost;
};

export const postServices = {
  createPost,
  getAllpostFromDB,
  getPostByIdFromDB,
};

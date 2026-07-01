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

  if (!post) {
    throw new Error("Post not found");
  }

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
        },
      },
      comments: true,
    },
  });

  return updatePost;
};

const getMyPostsFromDB = async (userId: string) => {
  const posts = await prisma.post.findMany({
    where: {
      authorId: userId, // Keep ONLY filtering arguments here
    },
    orderBy: {
      createAt: "desc", // Move this OUT of the where block to the root level
    },
    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return posts;
};


const updatePost = async (
  postId: string,
  payload: Partial<ICreatePostPayload>, // Using Partial so users can update individual fields
  userId: string,
  userRole: string,
) => {
  // 1. Fetch the existing post to verify ownership
  const existingPost = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!existingPost) {
    throw new Error("Post not found");
  }

  // 2. Authorization Check:
  // Allow if user is an ADMIN, OR if they are the actual author of the post
  const isAdmin = userRole === "ADMIN";
  const isAuthor = existingPost.authorId === userId;

  if (!isAdmin && !isAuthor) {
    throw new Error("You are not authorized to update this post");
  }

  // 3. Proceed with the update if checks pass
  const updatedPost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      ...payload,
    },
  });

  return updatedPost;
};

export const postServices = {
  createPost,
  getAllpostFromDB,
  getPostByIdFromDB,
  getMyPostsFromDB,
  updatePost,
};

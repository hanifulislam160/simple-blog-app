import { Router } from "express";
import { postController } from "./post.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/create-post",
  auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  postController.createPost,
);
router.get("/", postController.getAllPost);

router.get(
  "/my-posts",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  postController.getMyPosts,
);

router.put(
  "/:id",
  auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  postController.updatePost,
);

router.delete(
  "/:id",
  auth(Role.ADMIN, Role.USER, Role.AUTHOR), // Secures the endpoint
  postController.deletePost,
);

router.get(
  "/stats",
  auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  postController.getPostStats,
);

router.get("/:id", postController.getPostById);

export const postRoutes = router;

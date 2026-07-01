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

export const postRoutes = router;

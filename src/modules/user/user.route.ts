import { Router } from "express";
import { userController } from "./user.controller";
const router = Router();

// signup
router.post("/register", userController.registerUser);
router.get("/me", userController.getMyProfile);

export const userRoutes = router;

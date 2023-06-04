import { Router } from "express";
import userController from "../controllers/UserController";
import AuthMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.patch(
  "/follow/:id",
  AuthMiddleware.verifyToken,
  userController.followUser
);

router.patch(
  "/unfollow/:id",
  AuthMiddleware.verifyToken,
  userController.unfollowUser
);

export default router;

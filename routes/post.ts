import { Router } from "express";
import authController from "../controllers/PostController";
import AuthMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.post("/create", AuthMiddleware.verifyToken, authController.createPost);
router.put(
  "/update/:id",
  AuthMiddleware.verifyToken,
  authController.updatePost
);
router.delete(
  "/delete/:id",
  AuthMiddleware.verifyToken,
  authController.deletePost
);
router.get(
  "/getListOfUser/:userId",
  AuthMiddleware.verifyToken,
  authController.getListPostOfUser
);
router.get(
  "/getAllPosts",
  // AuthMiddleware.verifyToken,
  authController.getAllPost
);

export default router;

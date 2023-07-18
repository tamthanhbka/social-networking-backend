import { Router } from "express";
import postController from "../controllers/PostController";
import AuthMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.post("/create", AuthMiddleware.verifyToken, postController.createPost);
router.put(
  "/update/:id",
  AuthMiddleware.verifyToken,
  postController.updatePost
);
router.delete(
  "/delete/:id",
  AuthMiddleware.verifyToken,
  postController.deletePost
);
router.get(
  "/getListPostsOfUser/:id",
  AuthMiddleware.verifyToken,
  postController.getListPostsOfUser
);
router.get(
  "/getAllPosts",
  AuthMiddleware.verifyToken,
  postController.getAllPost
);
router.post(
  "/createPostOfGroup",
  AuthMiddleware.verifyToken,
  postController.createPostOfGroup
);
router.get(
  "/isPostOfGroup",
  AuthMiddleware.verifyToken,
  postController.isPostOfGroup
);

export default router;

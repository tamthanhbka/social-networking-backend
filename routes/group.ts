import { Router } from "express";
import groupController from "../controllers/GroupController";
import AuthMiddleware from "../middlewares/auth.middleware";

const router = Router();
router.post("/create", AuthMiddleware.verifyToken, groupController.createGroup);
router.post(
  "/joinGroup/:groupId",
  AuthMiddleware.verifyToken,
  groupController.joinGroup
);
router.post(
  "/outGroup/:groupId",
  AuthMiddleware.verifyToken,
  groupController.outGroup
);
router.get(
  "/getInfoGroup/:id",
  AuthMiddleware.verifyToken,
  groupController.getInfoGroup
);
router.get(
  "/getListMember/:id",
  AuthMiddleware.verifyToken,
  groupController.getListMember
);
router.get(
  "/getListPosts/:id",
  AuthMiddleware.verifyToken,
  groupController.getListPosts
);
router.get(
  "/getListRequestJoinGroup/:id",
  AuthMiddleware.verifyToken,
  groupController.getListRequestJoinGroup
);
router.post(
  "/acceptMember/:id",
  AuthMiddleware.verifyToken,
  groupController.acceptMember
);
export default router;

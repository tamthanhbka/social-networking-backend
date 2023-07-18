import { Router } from "express";
import meController from "../controllers/MeController";
import AuthMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.get("/", AuthMiddleware.verifyToken, meController.getMe);
router.get(
  "/getListPosts",
  AuthMiddleware.verifyToken,
  meController.getListPosts
);
router.get(
  "/getIsFollowedPeople",
  AuthMiddleware.verifyToken,
  meController.getIsFollowedPeople
);
router.get(
  "/getListGroup",
  AuthMiddleware.verifyToken,
  meController.getListGroup
);
router.post("/updateInfo", AuthMiddleware.verifyToken, meController.updateInfo);
export default router;

import { Router } from "express";
import authController from "../controllers/AuthController";
import AuthMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/logout", AuthMiddleware.verifyToken, authController.logout);

export default router;

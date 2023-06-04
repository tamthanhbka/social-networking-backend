import { Router } from "express";
import meController from "../controllers/MeController";
import AuthMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.get("/", AuthMiddleware.verifyToken, meController.getMe);

export default router;

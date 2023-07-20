import { Router } from "express";
import chatController from "../controllers/Chat.controller";
import AuthMiddleware from "../middlewares/auth.middleware";
const router = Router();
router.post("/sendToUser", AuthMiddleware.verifyToken, chatController.sendToUser);
router.get("/getAllChat", AuthMiddleware.verifyToken, chatController.getAllChat);
router.get("/getChat/:id", AuthMiddleware.verifyToken, chatController.getChat);
export default router;
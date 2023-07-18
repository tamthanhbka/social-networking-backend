import { Response, Request, NextFunction } from "express";
import userService from "../services/user.services";
import { JsonWebTokenError } from "jsonwebtoken";

const AuthMiddleware = {
  async verifyToken(
    req: Request & { payload?: any },
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = <string>req.cookies.token;
      if (!token) throw "Invalid token";
      req.payload = userService.decodeToken(token);
      if (!req.payload) {
        res
          .clearCookie("token")
          .status(401)
          .json({ success: false, error: "Invalid token" });
        return;
      }
      next();
    } catch (error: any) {
      if (typeof error === "string") {
        res.status(401).json({
          success: false,
          message: error,
          // , type: "token"
        });
        return;
      }
      if (error instanceof JsonWebTokenError) {
        res.status(401).json({
          success: false,
          message: error.message,
          // , type: "token"
        });
        return;
      }
      res.status(500).json({ success: false, message: "Server error!!!" });
    }
  },
};
export default AuthMiddleware;

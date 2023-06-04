import { Response, Request, NextFunction } from "express";
import userService from "../services/user.services";

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
        res.clearCookie("token");
        return;
      }
      next();
    } catch (error: any) {
      if (typeof error === "string") {
        res.status(401).json({ success: false, message: error });
        return;
      }
      res.status(500).json({ success: false, message: "Server error!!!" });
    }
  },
};
export default AuthMiddleware;

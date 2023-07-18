import { Request, Response } from "express";
import userService from "../services/user.services";
import { UserDocument } from "../models/User.model";
const AuthController = {
  // /auth/login
  async login(req: Request, res: Response) {
    try {
      const user = await userService.login(req.body);
      const token = userService.accessToken(user);
      res
        .cookie("token", token, { httpOnly: false })
        .json({ success: true, token });
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // /auth/signup
  async signup(req: Request, res: Response) {
    try {
      const user = await userService.signup(req.body);
      const token = userService.accessToken(user);
      res.cookie("token", token, { path: "/" }).json({ success: true, token });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // /auth/logout
  async logout(req: Request, res: Response) {
    res
      .clearCookie("token")
      .json({ success: true, message: "Logged out!", token: "" });
  },
};
export default AuthController;

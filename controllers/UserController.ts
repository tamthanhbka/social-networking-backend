import { JwtPayload } from "jsonwebtoken";
import User, { IUser, UserDocument } from "../models/user.models";
import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";

const UserController = {
  // PATCH: /user/follow/:id
  async followUser(req: Request & { payload?: any }, res: Response) {
    try {
      //id cua nguoi duoc follow
      const id = <string>req.params.id;
      const user = await User.findById(id);
      if (!user) throw "User not found!";

      //id cua nguoi follow
      const followerId = req.payload.id;
      const isFollower = await user.isFollower(followerId);
      if (!isFollower) {
        user.followers.push(followerId);
        await user.save();
        res
          .status(200)
          .json({ success: "true", message: "Followed successfully" });
        return;
      }
      res.status(401).json({ success: "false", message: "You already follow" });
    } catch (error: any) {
      console.log(error);
      if (typeof error === "string") {
        res.status(401).json({ success: "false", message: error });
        return;
      }
      res.status(500).json({
        status: "error",
        message: "Service error. Please try again later",
      });
    }
  },

  // PATCH user/unfollow:id
  async unfollowUser(req: Request & { payload?: any }, res: Response) {
    try {
      // id cua nguoi bi unfollow
      const id = <string>req.params.id;
      const user = await User.findById(id);
      if (!user) throw "User not found";

      //id cua nguoi unfollow
      const followerId = req.payload.id;
      const isFollower = await user.isFollower(followerId);

      if (isFollower) {
        user.followers = user.followers.reduce((p, v: string) => {
          if (v.toString() != followerId) p.push(v);
          return p;
        }, <string[]>[]);
        await user.save();
        res
          .status(200)
          .json({ success: "true", message: "Unfollowed successfully" });
        return;
      }
      res
        .status(401)
        .json({ success: "false", message: "You have not followed" });
    } catch (error: any) {
      if (typeof error === "string") {
        res.status(401).json({ success: "false", message: error });
        return;
      }
      res.status(500).json({
        status: "error",
        message: "Service error. Please try again later",
      });
    }
  },
};

export default UserController;

import { JwtPayload } from "jsonwebtoken";
import User, { IUser, UserDocument } from "../models/User.model";
import { Request, Response } from "express";
import Follow from "../models/Follow.model";

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
      const follow = await Follow.findOne({ user: id, follower: followerId });
      if (!follow) {
        Follow.create({ user: id, follower: followerId });
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
      const follow = await Follow.findOneAndDelete({
        user: id,
        follower: followerId,
      });
      if (follow) {
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
  // GET: /user/getInfo:id
  getInfo: async (req: Request & { payload?: any }, res: Response) => {
    try {
      const userId = <string>req.params.id;
      const user = await User.findById(userId);
      if (!user) throw "User not found";
      const follows = await Follow.find({ user: userId });
      const followerIds = follows.map((follow) => follow.follower);
      // const followers = await User.find({ _id: { $in: followerIds } }).select(
      //   "-password"
      // );
      const followers = await User.aggregate([
        { $addFields: { id: { $toString: "$_id" } } },
        { $unset: ["_id", "password"] },
        { $match: { id: { $in: followerIds } } },
      ]);

      const { password, _id: id, ...data } = user.toJSON();
      res
        .status(200)
        .json({ success: "true", data: { id, ...data, followers } });
    } catch (error) {
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
  getListGroup: async (req: Request & { payload?: any }, res: Response) => {},
};

export default UserController;

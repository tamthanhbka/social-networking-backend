import { Request, Response } from "express";
import User from "../models/User.model";
import { UserDocument } from "../models/User.model";
import Post from "../models/Post.model";
import Follow from "../models/Follow.model";
import Group from "../models/Group.model";
import JoinGroup from "../models/JoinGroup.model";
import { log } from "console";
const MeController = {
  getMe: async (req: Request & { payload?: any }, res: Response) => {
    try {
      const userId: string = req.payload?.id;
      const user = await User.findById(userId);
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      const { password, _id: id, ...data } = user.toJSON();
      res.json({ success: true, data: { ...data, id } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getListPosts: async (req: Request & { payload?: any }, res: Response) => {
    try {
      const userId: string = req.payload?.id;
      const result = (await Post.find({ author: userId })).map((v) =>
        v.toJSON()
      );
      if (result) {
        const posts = await Promise.all(
          result.map(async (post) => {
            const user = await User.findById(userId);
            if (user) {
              const { username, _id: id, avatar } = user.toJSON();
              return { ...post, author: { username, id, avatar } };
            }
            return post;
          })
        );
        res.json({ status: "success", data: posts.reverse() });
        return;
      }
      res.json({ status: "success", message: "No have post!" });
    } catch (error) {
      return res.status(503).json({
        status: "error",
        message: "Service error. Please try again later",
      });
    }
  },
  getIsFollowedPeople: async (
    req: Request & { payload?: any },
    res: Response
  ) => {
    try {
      const userId = req.payload?.id;
      const isFolloweds = await Follow.find({ follower: userId });
      const isFollowedPeopleIds = isFolloweds.map(
        (isFollowed) => isFollowed.user
      );
      const isFollowedPeople = await User.aggregate([
        { $addFields: { id: { $toString: "$_id" } } },
        { $unset: ["_id", "password"] },
        { $match: { id: { $in: isFollowedPeopleIds } } },
      ]);
      res.status(200).json({ message: "Success", data: isFollowedPeople });
    } catch (error) {
      return res.status(503).json({
        status: "error",
        message: "Service error. Please try again later",
      });
    }
  },
  getListGroup: async (req: Request & { payload?: any }, res: Response) => {
    const userId = req.payload?.id;
    const joinGroups = await JoinGroup.find({ member: userId });
    const groups = [];
    for (const joinGroup of joinGroups) {
      const result = await Group.findById(joinGroup.groupId);
      let group;
      if (!result) {
        group = result;
      } else {
        const { _id: id, ...rest } = result.toJSON();
        group = { id, ...rest };
      }
      groups.push(group);
    }
    res.status(200).json({ data: groups });
  },
  updateInfo: async (req: Request & { payload?: any }, res: Response) => {
    try {
      const userId = req.payload?.id;
      console.log("avatar", req.body.avatar);

      const user = await User.findByIdAndUpdate(userId, req.body, {
        new: true,
      });
      if (user) {
        res.status(200).json({ message: "Update success", data: user });
        return;
      }
    } catch (error) {
      return res.status(503).json({
        status: "error",
        message: "Service error. Please try again later",
      });
    }
  },
};
export default MeController;

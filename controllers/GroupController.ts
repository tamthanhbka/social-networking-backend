import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

import Group from "../models/Group.model";
import JoinGroup from "../models/JoinGroup.model";
import RequestJoinGroup from "../models/RequestJoinGroup.model";
import User, { UserDocument } from "../models/User.model";
import GroupPost from "../models/GroupPost.model";
import Post from "../models/Post.model";

const GroupController = {
  async createGroup(req: Request & { payload?: any }, res: Response) {
    try {
      //id cua nguoi tao group (admin cua group)
      const userId = req.payload.id;
      const attr = {
        admin: userId,
        avatar:
          "https://www.facebook.com/images/groups/groups-default-cover-photo-2x.png",
        ...req.body,
      };
      await Group.validate(attr);
      const group = await Group.create(attr);
      const { _id: id, ...rest } = group.toJSON();
      JoinGroup.create({ groupId: id, member: userId });
      res.status(200).json({ status: "success", data: { id, ...rest } });
    } catch (error: any) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          status: "error",
          message: error.message,
        });
      }
      res.status(500).json({
        status: "error",
        message: "Service error. Please try again later",
      });
    }
  },
  // PATCH : /group/addMember:id
  async addMember(req: Request & { payload?: any }, res: Response) {},
  async removeMember() {},
  async updateInfoGroup() {},
  async removeGroup() {},
  // GET : /group/getInfoGroup/:id
  async getInfoGroup(req: Request & { payload?: any }, res: Response) {
    try {
      const groupId = req.params.id;
      const result = await Group.findById(groupId);
      if (result) {
        const { _id: id, ...rest } = result.toJSON();
        const group = { id, ...rest };
        res.status(200).json({ data: group });
        return;
      }
      res.status(404).json({ message: "Group not found" });
    } catch (error: any) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          status: "error",
          message: error.message,
        });
      }
      res.status(500).json({
        status: "error",
        message: "Service error. Please try again later",
      });
    }
  },
  // GET : /group/getListMember/:id
  async getListMember(req: Request & { payload?: any }, res: Response) {
    try {
      const groupId = req.params.id;
      const listJoinGroup = await JoinGroup.find({ groupId: groupId });
      const listMember = await Promise.all(
        listJoinGroup.map(async (joinGroup) => {
          const result = await User.findById(joinGroup.member);
          if (result) {
            const { _id: id, ...rest } = result?.toJSON();
            const person = { id, ...rest };
            return person;
          }
        })
      );
      res.json({ data: listMember });
    } catch (error: any) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          status: "error",
          message: error.message,
        });
      }
      res.status(500).json({
        status: "error",
        message: "Service error. Please try again later",
      });
    }
  },
  // GET : /group/getListRequestJoinGroup/:id
  async getListRequestJoinGroup(
    req: Request & { payload?: any },
    res: Response
  ) {
    try {
      const groupId = req.params.id;
      const requestJoinGroups = await RequestJoinGroup.find({
        groupId: groupId,
      });
      const listPerson = await Promise.all(
        requestJoinGroups.map(async (requestJoinGroup) => {
          const result = await User.findById(requestJoinGroup.requestPerson);
          if (result) {
            const { _id: id, ...rest } = result?.toJSON();
            const person = { id, ...rest };
            return person;
          }
        })
      );
      res.json({ data: listPerson });
    } catch (error: any) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          status: "error",
          message: error.message,
        });
      }
      res.status(500).json({
        status: "error",
        message: "Service error. Please try again later",
      });
    }
  },
  // POST : /group/joinGroup/:groupId
  async joinGroup(req: Request & { payload?: any }, res: Response) {
    try {
      const userId = req.payload.id;
      const groupId = req.params.groupId;
      const group = await Group.findById(groupId);
      if (!group) {
        res.status(404).json({ message: "Group not found" });
        return;
      }
      const joinGroup = await JoinGroup.findOne({
        groupId: groupId,
        member: userId,
      });
      if (joinGroup) {
        res.json({ message: "You are already a member of this group!" });
        return;
      }
      if (group.status === "công khai") {
        JoinGroup.create({ groupId: groupId, member: userId });
        res.status(200).json({ message: "Join group successfully!" });
        return;
      }
      if (group.status === "riêng tư") {
        const requestJoinGroup = await RequestJoinGroup.findOne({
          groupId: groupId,
          requestPerson: userId,
        });
        if (requestJoinGroup) {
          res.json({
            message: "You are waiting for approval to join the group!",
          });
          return;
        }
        RequestJoinGroup.create({ groupId: groupId, requestPerson: userId });
        res.status(201).json({ message: "Waiting for approval!" });
        return;
      }
      res.json({ error: "Error creating" });
    } catch (error: any) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          status: "error",
          message: error.message,
        });
      }
      res.status(500).json({
        status: "error",
        message: "Service error. Please try again later",
      });
    }
  },
  //POST /group/outGroup/:groupId
  async outGroup(req: Request & { payload?: any }, res: Response) {
    try {
      const userId = req.payload.id;
      const groupId = req.params.groupId;
      const joinGroup = await JoinGroup.findOneAndDelete({
        groupId: groupId,
        member: userId,
      });
      if (joinGroup) {
        res
          .status(200)
          .json({ success: "true", message: "Out group successfully" });
        return;
      }
      res
        .status(401)
        .json({ success: "false", message: "You are not in this group yet!" });
    } catch (error: any) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          status: "error",
          message: error.message,
        });
      }
      res.status(500).json({
        status: "error",
        message: "Service error. Please try again later",
      });
    }
  },
  async acceptMember(req: Request & { payload?: any }, res: Response) {
    try {
      const groupId = req.params.id;
      const requestPersonId = req.body.requestPersonId;
      const requestPerson = await RequestJoinGroup.findOneAndDelete({
        groupId: groupId,
        requestPerson: requestPersonId,
      });
      if (!requestPerson) {
        res
          .status(404)
          .json({ message: "You have not requested to join the group!" });
        return;
      }
      const joinGroup = await JoinGroup.create({
        groupId: groupId,
        member: requestPersonId,
      });
      res
        .status(200)
        .json({ message: "Join group successfully!", data: joinGroup });
      return;
    } catch (error: any) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          status: "error",
          message: error.message,
        });
      }
      res.status(500).json({
        status: "error",
        message: "Service error. Please try again later",
      });
    }
  },
  //GET /group/getListPosts/:id
  async getListPosts(req: Request & { payload?: any }, res: Response) {
    try {
      const groupId = req.params.id;
      const results = await GroupPost.find({ groupId: groupId });
      const temps = await Promise.all(
        results.map(async (result) => {
          const post = await Post.findById(result.postId);
          return post?.toJSON();
        })
      );
      const posts = await Promise.all(
        temps.map(async (t) => {
          // const authorId = t.author;
          const author = await User.findById(t?.author);
          if (author) {
            const { username, _id: id, avatar } = author.toJSON();
            return { ...t, author: { username, id, avatar } };
          }
          return t;
        })
      );
      res.status(200).json({ data: posts.reverse() });
    } catch (error: any) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          status: "error",
          message: error.message,
        });
      }
      res.status(500).json({
        status: "error",
        message: "Service error. Please try again later",
      });
    }
  },
};

export default GroupController;

import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

import Post from "../models/Post.model";
import User from "../models/User.model";
import GroupPost from "../models/GroupPost.model";
import Group from "../models/Group.model";
import JoinGroup from "../models/JoinGroup.model";

const PostController = {
  //Get all post
  async getAllPost(req: Request & { payload?: any }, res: Response) {
    try {
      //todo
      // const userId:string = req.payload.id;

      //get all post
      const result = (await Post.find({})).map((v) => v.toJSON());
      const posts = await Promise.all(
        result.map(async (post) => {
          const authorId = post.author;
          const author = await User.findById(authorId);
          if (author) {
            const { username, _id: id, avatar } = author.toJSON();
            return { ...post, author: { username, id, avatar } };
          }
          return post;
        })
      );
      res.json({ status: "success", data: posts.reverse() });
    } catch (error) {
      return res.status(503).json({
        status: "error",
        message: "Service error. Please try again later",
      });
    }
  },
  // Get list post of user /post/getListPostsOfUser/:id
  async getListPostsOfUser(req: Request & { payload?: any }, res: Response) {
    try {
      const userId: string = req.params.id;
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
  // /post/create
  async createPost(req: Request & { payload?: any }, res: Response) {
    try {
      //id cua nguoi tao post
      const id = req.payload.id;
      const attr = { author: id, ...req.body };
      await Post.validate(attr);
      const post = await Post.create(attr);
      res.status(200).json({ status: "success", data: { post } });
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

  //Update Post
  async updatePost(req: Request, res: Response) {
    try {
      const attr = { ...req.body };
      await Post.validate(attr);
      const post = await Post.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        attr
      );
      if (!post) {
        return res
          .status(400)
          .json({ status: "error", message: "Can't find post" });
      }
      res.status(200).json({ status: "success", message: "Update success" });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Service error. Please try again later",
      });
    }
  },

  //Delete Post
  async deletePost(req: Request, res: Response) {
    try {
      const post = await Post.findOneAndDelete({
        _id: req.params.id,
      });
      if (!post) {
        return res
          .status(400)
          .json({ status: "error", message: "Can't find post" });
      }
      res.status(200).json({ status: "success", message: "Delete success" });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Service error. Please try again later",
      });
    }
  },
  //POST /post/createPostOfGroup
  async createPostOfGroup(req: Request & { payload?: any }, res: Response) {
    try {
      //id cua nguoi tao post
      const id = req.payload.id;
      const groupId = req.body.groupId;
      console.log(req.body);

      const joinGroup = await JoinGroup.findOne({
        groupId: groupId,
        member: id,
      });
      if (!joinGroup) {
        res.status(404).json({ message: "User has not joined the group!" });
        return;
      }
      const attr = { author: id, ...req.body };
      await Post.validate(attr);
      const post = await Post.create(attr);
      const groupPost = await GroupPost.create({
        groupId: groupId,
        postId: post._id,
      });
      res.status(200).json({ status: "success", data: { post, groupPost } });
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
  async isPostOfGroup(req: Request & { payload?: any }, res: Response) {
    try {
      const postId = req.body.postId;
      const groupPost = await GroupPost.findOne({ postId: postId });
      if (groupPost) {
        const group = await Group.findById(groupPost.groupId);
        res.status(200).json({ data: group });
        return;
      }
      res.status(201).json({ message: "Post is not of group!" });
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
export default PostController;

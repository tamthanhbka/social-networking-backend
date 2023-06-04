import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

import Post from "../models/post.models";
import User from "../models/user.models";

const PostController = {
  //Get all post
  async getAllPost(req: Request & { payload?: any }, res: Response) {
    try {
      //todo
      // const userId:string = req.payload.id;

      //get all post
      console.log(req.cookies.token);

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
  // Get list post of user
  async getListPostOfUser(req: Request, res: Response) {
    if (!isValidObjectId(req.params.userId)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid user's id" });
    }
    try {
      const post = await Post.findOne({ author: req.params.userId });
      if (!post) {
        return res
          .status(403)
          .json({ status: "error", message: "Can't find post" });
      }
      return res.status(200).json({ status: "success", data: post });
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
};
export default PostController;

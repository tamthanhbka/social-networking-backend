import { Model, Schema, model } from "mongoose";
import vld from "validator";
export interface IPost {
  //declare model properties here
  content: string;
  comments: {
    content: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
  }[];
  author: string;
  images: { link: string; createdAt: Date }[];
  likes: string[];
}
interface IPostMethods {
  //declare instance method here
}
interface PostModel extends Model<IPost, {}, IPostMethods> {
  //declare static method here
}
const schema = new Schema<IPost, PostModel, IPostMethods>(
  {
    //implement model properties here
    content: { type: String, require: true },
    comments: [
      {
        content: { type: String, require: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        userId: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    author: { type: String, ref: "User" },
    images: [
      {
        link: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    likes: [
      {
        type: String,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Post = model<IPost, PostModel>("Post", schema);
export default Post;

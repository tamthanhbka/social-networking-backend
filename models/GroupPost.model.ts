import { Model, Schema, model } from "mongoose";
import vld from "validator";
import User from "./User.model";
export interface IGroupPost {
  //declare model properties here
  groupId: string;
  postId: string;
}
interface IGroupPostMethods {
  //declare instance method here
}
interface GroupPostModel extends Model<IGroupPost, {}, IGroupPostMethods> {
  //declare static method here
}
const schema = new Schema<IGroupPost, GroupPostModel, IGroupPostMethods>(
  {
    groupId: { type: String, require: true },
    postId: { type: String, require: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const GroupPost = model<IGroupPost, GroupPostModel>("GroupPost", schema);
export default GroupPost;

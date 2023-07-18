import { Model, Schema, model } from "mongoose";

export interface IFollow {
  user: string; // id cua nguoi duoc theo doi
  follower: string; // id cua nguoi theo doi
}
interface IFollowMethods {
  //declare instance method here
}
interface FollowModel extends Model<IFollow, {}, IFollowMethods> {
  //declare static method here
}
const schema = new Schema<IFollow, FollowModel, IFollowMethods>(
  {
    user: { type: String, required: true },
    follower: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Follow = model<IFollow, FollowModel>("Follow", schema);
export default Follow;

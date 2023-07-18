import { Model, Schema, model } from "mongoose";
import vld from "validator";
import User from "./User.model";
export interface IGroup {
  //declare model properties here
  groupName: string;
  status: string;
  admin: string;
  avatar: string;
  // members: string[];
  // joinRequestUser: string[];
}
interface IGroupMethods {
  //declare instance method here
}
interface GroupModel extends Model<IGroup, {}, IGroupMethods> {
  //declare static method here
}
const schema = new Schema<IGroup, GroupModel, IGroupMethods>(
  {
    groupName: { type: String, require: true },
    status: { type: String, require: true },
    admin: { type: String }, //admin's id
    avatar: { type: String },
    // members: [{ type: String }], //members's id
    // joinRequestUser: [{ type: String }], // list join group request userId
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const Group = model<IGroup, GroupModel>("Group", schema);
export default Group;

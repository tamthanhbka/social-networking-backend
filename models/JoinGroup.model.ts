import { Model, Schema, model } from "mongoose";
import vld from "validator";
import User from "./User.model";
export interface IJoinGroup {
  //declare model properties here
  groupId: string;
  member: string;
}
interface IJoinGroupMethods {
  //declare instance method here
}
interface JoinGroupModel extends Model<IJoinGroup, {}, IJoinGroupMethods> {
  //declare static method here
}
const schema = new Schema<IJoinGroup, JoinGroupModel, IJoinGroupMethods>(
  {
    groupId: { type: String, required: true },
    member: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const JoinGroup = model<IJoinGroup, JoinGroupModel>("JoinGroup", schema);
export default JoinGroup;

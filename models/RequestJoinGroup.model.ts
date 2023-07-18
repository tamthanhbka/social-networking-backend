import { Model, Schema, model } from "mongoose";
import vld from "validator";
import User from "./User.model";
export interface IRequestJoinGroup {
  //declare model properties here
  groupId: string;
  requestPerson: string;
}
interface IRequestJoinGroupMethods {
  //declare instance method here
}
interface RequestJoinGroupModel
  extends Model<IRequestJoinGroup, {}, IRequestJoinGroupMethods> {
  //declare static method here
}
const schema = new Schema<
  IRequestJoinGroup,
  RequestJoinGroupModel,
  IRequestJoinGroupMethods
>(
  {
    groupId: { type: String, required: true },
    requestPerson: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const RequestJoinGroup = model<IRequestJoinGroup, RequestJoinGroupModel>(
  "RequestJoinGroup",
  schema
);
export default RequestJoinGroup;

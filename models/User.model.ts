import { Model, Schema, model, Document, Types } from "mongoose";
import vld from "validator";
export interface IUser {
  //declare model properties here
  username: string;
  email: string;
  phone: string;
  avatar: string;
  isActivated: boolean;
  password: string;
}
interface IUserMethods {
  //declare instance method here
  comparePassword(password: string): Promise<boolean>;
  isFollower(this: UserDocument, id: string): Promise<boolean>;
}
interface UserModel extends Model<IUser, {}, IUserMethods> {
  //declare static method here
  isTakenInfo(info: { email: string; phone: string }): Promise<boolean>;
}
const schema = new Schema<IUser, UserModel, IUserMethods>(
  {
    //implement model properties here
    username: {
      type: String,
      required: true,
    },
    phone: { type: String, required: true },
    avatar: { type: String },
    isActivated: { type: Boolean, default: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

//implement instance method here
schema.methods.comparePassword = async function (password: string) {
  return vld.equals(password, this.password);
};
//implement static method here
schema.statics.isTakenInfo = async function (info: {
  email: string;
  phone: string;
}) {
  const { email, phone } = info;
  const user = await this.find({
    $or: [{ email }, { phone }],
  });
  return user.length > 0;
};

const User = model<IUser, UserModel>("User", schema);
export type UserDocument = Document & IUserMethods & IUser;
export default User;

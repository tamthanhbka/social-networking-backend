import { Model, Schema, model, Types, Document } from "mongoose";
export interface IChat {
  //declare model properties here
  //example: `name: string`
  from: string;
  to: string;
  type: "text" | "image" | "video" | "audio" | "file";
  content: string;
}
interface IChatMethods {
  //declare instance method here
  //example: `getName(): string`
}
interface ChatModel extends Model<IChat, {}, IChatMethods> {
  //declare static method here
  //example: `createInstance(): Instance`
}
const schema = new Schema<IChat, ChatModel, IChatMethods>(
  {
    //implement model properties here
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["text", "image", "video", "audio", "file"],
      default: "text",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

//implement instance method here
/*
example:
schema.methods.getName =  function () {
});
*/

//implement static method here
/*
example:
schema.statics.createInstance = function () {
});
*/
const Chat = model<IChat, ChatModel>("Chat", schema);
export type ChatDocument = Document<unknown, {}, IChat> &
  Omit<
    IChat & {
      _id: Types.ObjectId;
    },
    keyof IChatMethods
  > &
  IChatMethods;
export default Chat;

import { Request, Response } from "express";
import Chat from "../models/Chat.model";
import { sendMessage } from "../socket";
const chatController = {
  sendToUser: async (req: Request & { payload?: any }, res: Response) => {
    try {
      const from = <string>req.payload?.id;
      const { to, type, content } = req.body;
      const chat = new Chat({
        from,
        to,
        type,
        content,
      });
      await chat.validate();
      await chat.save();
      sendMessage(chat.toJSON());
      res.json({ success: true, data: chat });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getAllChat: async (req: Request & { payload?: any }, res: Response) => {
    try {
      const userId = <string>req.payload?.id;
      const lastChat = await Chat.aggregate([
        {
          $match: {
            $or: [
              {
                from: userId,
              },
              {
                to: userId,
              },
            ],
          },
        },
        {
          $group: {
            _id: {
              from: "$from",
              to: "$to",
            },
            id: {
              $last: "$_id",
            },
            type: {
              $last: "$type",
            },
            content: {
              $last: "$content",
            },
            createdAt: {
              $last: "$createdAt",
            },
            updatedAt: {
              $last: "$updatedAt",
            },
          },
        },
        {
          $addFields: {
            from: "$_id.from",
            to: "$_id.to",
          },
        },
        {
          $unset: ["_id"],
        },
      ]);
      res.json({ success: true, data: lastChat.reverse() });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getChat: async (req: Request & { payload?: any }, res: Response) => {
    try {
      const userId = <string>req.payload?.id;
      const { id } = req.params;
      const chats = await Chat.aggregate([
        {
          $match: {
            $or: [
              {
                from: userId,
                to: id,
              },
              {
                from: id,
                to: userId,
              },
            ],
          },
        },
        {
          $addFields: {
            id: "$_id",
          },
        },
      ]);
      res.json({ success: true, data: chats.reverse() });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
export default chatController;

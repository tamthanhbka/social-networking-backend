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
          $sort: {
            createdAt: -1,
          },
        },
        {
          $group: {
            _id: {
              $cond: {
                if: {
                  $eq: ["$from", userId],
                },
                then: "$to",
                else: "$from",
              },
            },
            id: {
              $first: "$_id",
            },
            from: {
              $first: "$from",
            },
            to: {
              $first: "$to",
            },
            type: {
              $first: "$type",
            },
            content: {
              $first: "$content",
            },
            createdAt: {
              $first: "$createdAt",
            },
          },
        },
        {
          $addFields: {
            id: "$_id",
          },
        },
      ]);
      res.json({
        success: true,
        data: lastChat.sort((c1, c2) => {
          const d1 = new Date(c1.createdAt);
          const d2 = new Date(c2.createdAt);
          return d2.getTime() - d1.getTime();
        }),
      });
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

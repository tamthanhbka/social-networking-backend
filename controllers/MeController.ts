import { Request, Response } from "express";
import User from "../models/user.models";
import { UserDocument } from "../models/user.models";
const MeController = {
  getMe: async (req: Request & { payload?: any }, res: Response) => {
    try {
      const userId: string = req.payload?.id;
      const user = await User.findById(userId);
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      const { password, _id: id, ...data } = user.toJSON();
      res.json({ success: true, data: { ...data, id } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
export default MeController;

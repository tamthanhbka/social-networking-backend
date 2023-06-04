import User, { IUser, UserDocument } from "../models/user.models";
import { Error } from "mongoose";
import jwt from "jsonwebtoken";

const UserService = {
  async login({ email, password }: { email?: string; password?: string }) {
    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Email or password is incorrect");
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new Error("Email or password is incorrect");
      }
      return user;
    } catch (error) {
      throw error;
    }
  },
  async signup(body: IUser) {
    // const { username, fullname, email, phone, avatar, role, password } = body;
    try {
      const user = new User(body);
      await user.validate();

      const isTaken = await User.isTakenInfo({
        email: user.email,
        phone: user.phone,
      });

      if (isTaken) {
        throw new Error("Email or phone is already taken");
      }

      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  },
  //init accessToken
  accessToken(user: UserDocument) {
    const KEY = <string>process.env.JWT_ACCESS_KEY;
    return jwt.sign({ id: user.id }, KEY, {
      expiresIn: "1d",
    });
  },

  //decode token
  decodeToken(token: string) {
    const KEY = <string>process.env.JWT_ACCESS_KEY;
    return jwt.verify(token, KEY);
  },
};
export default UserService;

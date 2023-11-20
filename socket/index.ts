import { Server } from "http";
import { Server as SocketServer } from "socket.io";
import { ChatDocument, IChat } from "../models/Chat.model";
const socket: { io?: SocketServer } = {};
const setSocket = (io: SocketServer) => {
  socket.io = io;
};
const getSocket = () => {
  return socket.io as SocketServer;
};
/**
 * Map<userId, socketId>
 */
const onlineUsers = new Map<string, string>();
export const initSocket = <T extends Server>(httpServer: T) => {
  const socketio = new SocketServer(httpServer, {
    cors: {
      origin: "*",
    },
  });
  socketio.on("connection", (socket) => {
    socket.on("online", (userId: string) => {
      addOnlineUser(userId, socket.id);
      console.log("user online", userId);
    });
    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
      removeOnlineUserBySocketId(socket.id);
    });
  });
  setSocket(socketio);
  return socketio;
};
/**
 * get online users
 */
export const getOnlineUsers = () => {
  return Array.from(onlineUsers.keys());
};
export const addOnlineUser = (userId: string, socketId: string) => {
  onlineUsers.set(userId, socketId);
};
export const removeOnlineUserByUserId = (userId: string) => {
  onlineUsers.delete(userId);
};
export const removeOnlineUserBySocketId = (socketId: string) => {
  onlineUsers.forEach((value, key) => {
    if (value === socketId) {
      onlineUsers.delete(key);
    }
  });
};
export const sendMessage = (data: IChat) => {
  const { to } = data;
  const socketId = onlineUsers.get(to);
  if (socketId) {
    getSocket().to(socketId).emit("new-message", data);
  }
};
export const deleteMessage = (data: IChat) => {
  const { to } = data;
  const socketId = onlineUsers.get(to);
  if (socketId) {
    getSocket().to(socketId).emit("delete-message", data);
  }
};

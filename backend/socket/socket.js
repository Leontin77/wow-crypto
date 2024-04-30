import {Server} from "socket.io";
import http from "http";
import express from "express";
import User from "../models/user.model.js";

const app = express();
const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: ["http://localhost:3000"],
//         methods: ["GET", "POST"],
//     },
// });
//
// const userSocketMap = {};
//
// io.on("connection", async (socket) => {
//     const userId = socket.handshake.query.userId;
//     userSocketMap[userId] = socket.id;
//
//     socket.join(userId);
//
//     socket.on("getUser", async () => {
//         try {
//             const user = await User.findById(userId);
//             io.to(userId).emit("getUser", user);
//         } catch (error) {
//             console.error("Error fetching user:", error);
//         }
//     });
//
//     socket.on("sendMessage", async (message) => {
//         try {
//             const newMessage = new Message({
//                 senderId: message.senderId,
//                 chatId: message.chatId,
//                 message: message.message,
//             });
//
//             const chat = await Chat.findById(message.chatId);
//
//             chat.messages.push(newMessage._id);
//             await Promise.all([chat.save(), newMessage.save()]);
//
//             const chatUpdated = await Chat.findById(message.chatId).populate("messages");
//
//             io.to(Array.from(chatUpdated.users)).emit("updatedChat", chatUpdated);
//             // io.emit("updatedChat", chatUpdated);
//         } catch (error) {
//             console.error("Error handling message:", error);
//         }
//     });
//
//     socket.on("getMessages", async () => {
//         try {
//             const user = await User.findById(userId);
//             const chat = await Chat.findOne({chatId: user.chatId}).populate("messages");
//
//             io.to(userId).emit("updatedChat", chat);
//         } catch (error) {
//             console.error("Error fetching messages:", error);
//         }
//     });
//
//     socket.on('updateChatId', async ({chatId}) => {
//         try {
//             const userUpdated = await User.findByIdAndUpdate(userId, {chatId});
//             const chat = await Chat.findOne({chatId}).populate("messages");
//
//             io.to(userId).emit("getUser", userUpdated);
//             io.to(userId).emit("updatedChat", chat);
//         } catch (error) {
//             console.error('Error updating chatId:', error);
//         }
//     })
//
//     try {
//         const chats = await Chat.find();
//
//         io.emit("updatedChats", chats);
//     } catch (error) {
//         console.error("Error fetching chats:", error);
//     }
//
//     socket.on("disconnect", () => {
//         console.log("User disconnected", userId);
//         delete userSocketMap[userId];
//     });
// });

export {app, server};

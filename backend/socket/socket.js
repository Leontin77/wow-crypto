import {Server} from "socket.io";
import http from "http";
import express from "express";
import User from "../models/user.model.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:5173"],
        methods: ["GET", "POST"],
    },
});
//
// const userSocketMap = {};
//
io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;
    socket.join(userId);
    let user = await User.findOne({id: userId});
    let gold = 0 + user?.score || 0;

    // const updateUserGold = async () => {
    //     const now = Date.now();
    //     const lastOnline = new Date(user.lastClime).getTime();
    //     const timeDifference = Math.min((now - lastOnline) / 1000, 7200);
    //
    //     const goldToAdd = user.stats.strength * timeDifference * 1000;
    //
    //     // user.score = user.score ? user.score + goldToAdd : goldToAdd;
    //     // user.lastClime = now;
    //
    //     await user.save();
    //     return {goldToAdd, timeDifference};
    // };
    // io.to(userId).emit("offlineGold", await updateUserGold());

    // socket.on("offlineGold", async () => {
    //     try {
    //         const data = await updateUserGold()
    //
    //         io.to(userId).emit("offlineGold", data);
    //     } catch (error) {
    //         console.error("Error fetching offlineGold:", error);
    //     }
    // });


    // const interval = setInterval(() => {
    //     gold += user.stats.strength;
    //     io.to(userId).emit("gold", gold);
    // }, 1000);


    // console.log("userId", user)


    io.emit("getUser", user);


    socket.on("updateUser", async ({data}) => {
        try {

            console.log("data", data)

            io.to(userId).emit("getUser", user);

        } catch (error) {
            console.error("Error fetching user:", error);
        }
    });


    socket.on("claim", async () => {
        try {

            user.lastClime = Date.now();
            user.save();
            io.to(userId).emit("getUser", user);

        } catch (error) {
            console.error("Error fetching user:", error);
        }
    });

    socket.on("getUser", async () => {
        try {
            const user = await User.findById(userId);

            io.to(userId).emit("getUser", user);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected", userId);

        // clearInterval(interval);
        // user.score = gold;
        // user.lastClime = Date.now();
        //
        // user.save();


        // delete userSocketMap[userId];
    });
});

export {app, server};

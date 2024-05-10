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

    const updateUserEnergy = async () => {
        const now = Date.now();
        const lastUpdate = new Date(user.energyTemp.time).getTime();
        const timeDifference = Math.min((now - lastUpdate) / 1000, 7200);

        const energyToAdd = user.stats.speed * timeDifference;

        user.energyTemp = {value: user.energyTemp.value + +energyToAdd.toFixed(1), time: now};

        await user.save();
    };
    await updateUserEnergy()
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



    io.emit("getUser", user);


    socket.on("updateUser", async (data) => {
        try {
            console.log("!!!!!! updateUser", data)
            user.score += data.score;
            user.energyTemp = { value: data.energy, time: Date.now()};
            user.save();
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
        // user.save();
    });
});

export {app, server};

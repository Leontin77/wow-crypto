// import {Server} from "socket.io";
// import http from "http";
// import express from "express";
// import User from "../models/user.model.js";

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: [
//             "http://localhost:3000",
//             "http://localhost:5173",
//             "https://wow-crypto.onrender.com",
//             "https://leontin77.github.io/wow",
//             "https://leontin77.github.io",
//         ],
//         methods: ["GET", "POST"],
//     },
// });
// //
// // const userSocketMap = {};
// //
// io.on("connection", async (socket) => {
//     const userId = socket.handshake.query.userId;
//     socket.join(userId);
//     let user = await User.findOne({id: userId});

//     const updateUserEnergy = async () => {
//         const now = Date.now();
//         const lastUpdate = new Date(user?.energyTemp?.time).getTime();
//         const timeDifference = Math.min((now - lastUpdate) / 1000, 7200);

//         const energyToAdd = user?.stats?.speed * timeDifference;

//         if (!user?.energyTemp) return

//         if ((+energyToAdd + user?.energyTemp?.value) > user?.stats?.energy) {
//             user.energyTemp = {value: user?.stats?.energy, time: Date.now()};
//         } else {
//             user.energyTemp = {value: user?.energyTemp?.value + +energyToAdd.toFixed(1), time: Date.now()};
//         }

//         await user.save();
//     };
//     await updateUserEnergy()
//     // io.to(userId).emit("offlineGold", await updateUserGold());

//     // socket.on("offlineGold", async () => {
//     //     try {
//     //         const data = await updateUserGold()
//     //
//     //         io.to(userId).emit("offlineGold", data);
//     //     } catch (error) {
//     //         console.error("Error fetching offlineGold:", error);
//     //     }
//     // });


//     io.emit("getUser", user);


//     socket.on("updateUser", async (data) => {
//         try {
//             // console.log("!!!!!! updateUser", data)
//             user.score = data.score;
//             user.energyTemp = {value: data.energy, time: Date.now()};
//             user.save();
//         } catch (error) {
//             console.error("Error fetching user:", error);
//         }
//     });


//     socket.on("claim", async (data) => {
//         try {

//             user.lastClime = data;
//             user.save();

//         } catch (error) {
//             console.error("Error fetching user:", error);
//         }
//     });

//     socket.on("getUser", async () => {
//         try {
//             const user = await User.findById(userId);

//             io.to(userId).emit("getUser", user);
//         } catch (error) {
//             console.error("Error fetching user:", error);
//         }
//     });

//     socket.on("disconnect", () => {
//         console.log("User disconnected", userId);
//         // user.save();
//     });
// });

// export {app, server};

import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "../models/user.model.js";
import mongoose from "mongoose";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",
            "http://localhost:5173",
            "https://wow-crypto.onrender.com",
            "https://leontin77.github.io/wow",
            "https://leontin77.github.io",
        ],
        methods: ["GET", "POST"],
    },
});

const userSaveLocks = {};

io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;
    socket.join(userId);
    let user = await User.findOne({ id: userId });

    const acquireLock = (userId) => {
        if (!userSaveLocks[userId]) {
            userSaveLocks[userId] = false;
        }
        return new Promise((resolve) => {
            const waitForLock = () => {
                if (!userSaveLocks[userId]) {
                    userSaveLocks[userId] = true;
                    resolve();
                } else {
                    setTimeout(waitForLock, 100);
                }
            };
            waitForLock();
        });
    };

    const releaseLock = (userId) => {
        userSaveLocks[userId] = false;
    };

    const updateUserEnergy = async () => {
        await acquireLock(userId);
        try {
            const now = Date.now();
            const lastUpdate = new Date(user?.energyTemp?.time).getTime();
            const timeDifference = Math.min((now - lastUpdate) / 1000, 7200);
            const energyToAdd = user?.stats?.speed * timeDifference;

            if (!user?.energyTemp) return;

            if ((+energyToAdd + user?.energyTemp?.value) > user?.stats?.energy) {
                user.energyTemp = { value: user?.stats?.energy, time: Date.now() };
            } else {
                user.energyTemp = { value: user?.energyTemp?.value + +energyToAdd.toFixed(1), time: Date.now() };
            }

            await user.save();
        } finally {
            releaseLock(userId);
        }
    };

    await updateUserEnergy();

    io.emit("getUser", user);

    socket.on("updateUser", async (data) => {
        try {
            await acquireLock(userId);
            user.score = data.score;
            user.energyTemp = { value: data.energy, time: Date.now() };
            await user.save();
        } catch (error) {
            console.error("Error updating user:", error);
        } finally {
            releaseLock(userId);
        }
    });

    socket.on("claim", async (data) => {
        try {
            await acquireLock(userId);
            user.lastClime = data;
            await user.save();
        } catch (error) {
            console.error("Error updating user:", error);
        } finally {
            releaseLock(userId);
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
    socket.on("getReferralStats", async () => {
        try {
            const user = await User.findOne({ id: userId }).populate('referrals');
            io.to(userId).emit("referralStats", user);
        } catch (error) {
            console.error("Error fetching referral stats:", error);
            socket.emit("referralStatsError", { message: "Error fetching referral stats" });
        }
    });
    socket.on("claimRefRewards", async ({refarralRewardsArray, amountToClaim}) => {
        try {
            await acquireLock(userId);
            user.referralRewards = refarralRewardsArray;
            user.score += amountToClaim;

            await user.save();
        } catch (error) {
            console.error("Error updating user:", error);
        } finally {
            releaseLock(userId);
        }
    })
    
    socket.on("disconnect", () => {
        console.log("User disconnected", userId);
    });
});

export { app, server };


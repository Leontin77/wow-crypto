import dotenv from "dotenv";
import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRoutes from "./routes/user.routes.js";

import {app, server} from "./socket/socket.js";
import connectToMongoDB from "./utils/connectToMongoDB.js";
import {Markup, Scenes, session, Telegraf} from "telegraf";

import botMiddleware from "./middleware/botMiddleware.js";
import {tgIdValidator} from "./validators/index.js";

const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);

// app.use(express.static(path.join(__dirname, "/frontend/dist")));
//
// app.get("*", (req, res) => {
// 	res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
// });


const bot = new Telegraf(process.env.BOT_TOKEN)
let gameUrl = "https://leontin77.github.io/wow/";
const gameName = "wowtest";

const markup = Markup.inlineKeyboard([
    Markup.button.game("🎮 Play now!"),
    Markup.button.webApp("Launch", gameUrl),
]);
bot.use(async (ctx, next) => {
    const user = await botMiddleware.checkUser(ctx, next);

    console.log("!!!!!!!!!! user !!!!!!")
    console.log(user)
    console.log("!!!!!!!!!! user !!!!!!")

    if (user) {
        ctx.state.user = user;
    }

    return next();
})
bot.start(async (ctx) => {

        const id = ctx?.update?.message?.text?.split(" ")[1]

        if (id) {
            const user = await botMiddleware.checkRefCode(ctx, id);
        }

        ctx.setChatMenuButton({
            text: "Launch",
            type: "web_app",
            web_app: {url: gameUrl},
        })

        ctx.reply(
            "Launch mini app from inline keyboard!",
            Markup.inlineKeyboard([Markup.button.webApp("Launch", gameUrl)]),
        )
    },
);
// bot.command("foo", ctx => ctx.replyWithGame(gameName, markup));
// bot.gameQuery(ctx => {
//             console.log("22222222222222", ctx.update)
// });


// bot.command("keyboard", ctx => {
//         console.log("33333333333333333")
//         ctx.reply(
//             "Launch mini app from keyboard!",
//             Markup.keyboard([Markup.button.webApp("Launch", gameurl)]).resize(),
//         )
//     }
// );

// bot.command("setmenu", ctx =>
//     // sets Web App as the menu button for current chat
//     ctx.setChatMenuButton({
//         text: "Launch",
//         type: "web_app",
//         web_app: {url: gameurl},
//     }),
// );
// bot.command("inlinekb", ctx =>
//     ctx.reply(
//         "Launch mini app from inline keyboard!",
//         Markup.inlineKeyboard([Markup.button.webApp("Launch", gameurl)]),
//     ),
// );


bot.launch();

server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server Running on port ${PORT}`);
});

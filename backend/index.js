const express = require("express");
const path = require("path");
// const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

const TelegramBot = require("node-telegram-bot-api");
const TOKEN = "6895025275:AAG-QeuUGnZZ5ZvkkzDJ1BuTWNxrhU2KixE";
const bot = new TelegramBot(TOKEN, {
    polling: true
});

const port = process.env.PORT || 5002;

let gameurl = "https://leontin77.github.io/wow/";
const gameName = "wowtest";
// const queries = {};

const app = express();
// mongoose.connect(config.MONGO_URL);
app.use(helmet());

// app.use(cors({origin: _configureCors}));
app.use(rateLimit({
    windowMS: 15 * 60 * 1000,
    max: 100
}));

const morgan = require('morgan');

app.use(morgan('dev'));
// }

app.use(express.json());
app.use(express.urlencoded({extended: true}));


bot.onText(/help/, (msg) => bot.sendMessage(msg.from.id, "Say /game if you want to play."));
// bot.onText(/start|game/, (msg) => bot.sendGame(msg.from.id, gameName));
bot.onText(/start|game/, (msg) => bot.sendGame(msg.from.id, gameName));

bot.onText(/start|game/, (msg) => {



    bot.send_message(msg.from.id, gameName)
});


bot.onText("", (msg) => {
    console.log(msg)
 bot.sendMessage(msg.from.id, "22222")
}
);

bot.on("callback_query", function (query) {
    console.log(query)
    if (query.game_short_name !== gameName) {
        bot.answerCallbackQuery(query.id, "Sorry, '" + query.game_short_name + "' is not available.");
    } else {
        // bot.sendMessage( query.from.id,   "https://t.me/mgameWOWBot/wowtest")
        bot.answerCallbackQuery({
            callback_query_id: query.id,
            url: "https://t.me/mgameWOWBot/wowtest"
        });
    }
});
bot.getChatMenuButton({}, )

app.listen(port,
    // "'0.0.0.0",
    () => {
        console.log(`App work ${port}`);
        // defaultData();
        // startCron();
    });

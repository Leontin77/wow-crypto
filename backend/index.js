const express = require("express");
const path = require("path");
// const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

const TelegramBot = require("node-telegram-bot-api");
const TOKEN = "6895025275:AAG-QeuUGnZZ5ZvkkzDJ1BuTWNxrhU2KixE";
// t.me/mgameWOWBot
// t.me/mgameWOWBot?game=wowCrypto
// const server = express();
const bot = new TelegramBot(TOKEN, {
    polling: true
});

const port = process.env.PORT || 5000;

const gameName = "mgameWOWBot";
// const queries = {};

const app = express();
// mongoose.connect(config.MONGO_URL);
app.use(helmet());
// app.use(cors({origin: _configureCors}));
app.use(rateLimit({
    windowMS: 15 * 60 * 1000,
    max: 100
}));

// if (config.NODE_ENV === 'dev') {
const morgan = require('morgan');

app.use(morgan('dev'));
// }

app.use(express.json());
app.use(express.urlencoded({extended: true}));






bot.onText(/help/, (msg) => bot.sendMessage(msg.from.id, "Say /game if you want to play."));
bot.onText(/start|game/, (msg) => bot.sendGame(msg.from.id, gameName));
bot.on("callback_query", function (query) {
    if (query.game_short_name !== gameName) {
        bot.answerCallbackQuery(query.id, "Sorry, '" + query.game_short_name + "' is not available.");
    } else {
        queries[query.id] = query;
        let gameurl = "https://accsmarket.com/";
        bot.answerCallbackQuery({
            callback_query_id: query.id,
            url: gameurl
        });
    }
});






app.listen(port,
    // "'0.0.0.0",
    () => {
        console.log(`App work ${port}`);
        // defaultData();
        // startCron();
    });

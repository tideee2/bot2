const TelegramBot = require('node-telegram-bot-api');
let mongoose = require('mongoose');
let config = require('./config/config');
let User = require('./models/user-schema');
const request = require('request');

const token = config.token;

const bot = new TelegramBot(token, {polling: true});

mongoose.connect(`mongodb://${config.host}:${config.port}/${config.database}`, {
    user: config.user,
    pass: config.password
});

bot.onText(/\/register/, async(msg, match) => {

    const chatId = msg.chat.id;
    console.log(msg);

    try {

        let user = await User.findOne({username: msg.from.username});
        console.log(msg.from.username);
        if (user) {

            console.log('User already exist');
            bot.sendMessage(chatId, `You already register`);
        } else {
            console.log('new user');
            user = await User.create({
                firstName: msg.from.first_name,
                lastName: msg.from.last_name,
                id: msg.from.id,
                username: msg.from.username,
                chatId: chatId
            });
            bot.sendMessage(chatId, 'thanks, for register');
        }

    } catch (err) {
        console.log(err);
    }

});

bot.onText(/\/tournament (.+)/, async (msg, match) => {

    console.log('tournament');
    const chatId = msg.chat.id;
    const resp = match[1];
    if (resp !== config.secret || !resp) {
        bot.sendMessage(chatId, "you don't have permissions");
    } else {
        // const users = await User.find({});
        // const users = await User.count({});
        const users = await User.find({});
        const rndUser = await User.aggregate(
            [
                {
                    $sample: { size: 1 }
                }
            ]);
        console.log(rndUser);
        users.forEach(x => {
            bot.sendMessage(x.chatId, `And the winner is ${rndUser.username}`);
        });

        // console.log(users);
    }

});
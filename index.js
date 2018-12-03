const TelegramBot = require('node-telegram-bot-api');
let mongoose = require('mongoose');
let config = require('./config/config');
let User = require('./models/user-schema');
let Tournament = require('./models/tournament-schema');
const request = require('request');

const token = config.token;

const bot = new TelegramBot(token, {polling: true});

mongoose.connect(`mongodb://${config.host}:${config.port}/${config.database}`, {
    user: config.user,
    pass: config.password
});
bot.onText(/\/start/, async(msg, match) =>{
    const chatId = msg.chat.id;
    try {
        let user = await User.findOne({username: msg.from.username});
        console.log(msg.from.username);
        if (user) {
            console.log('User already exist');
            // bot.sendMessage(chatId, `You already register`);
        } else {
            console.log('new user');
            user = await User.create({
                firstName: msg.from.first_name,
                lastName: msg.from.last_name,
                id: msg.from.id,
                username: msg.from.username,
                chatId: chatId
            });
            // bot.sendMessage(chatId, 'thanks, for register');
        }

    } catch (err) {
        console.log(err);
    }
    bot.sendMessage(chatId, 'Добрый день, напишите /help , чтобы узнать команды бота');
});
bot.onText(/\/social (.+)/, async(msg, match) =>{
    const chatId = msg.chat.id;
    const resp = match[1];
    try {
        let user = await User.findOne({username: msg.from.username});
        console.log(msg.from.username);
        if (user) {
            console.log('User exist');
            user.social = resp;
            user = await User.findOneAndUpdate(user._id, user, {new: true});
            console.log(user);
            if (user) {
                console.log('add social link is success');
                bot.sendMessage(chatId, 'Ссылка на соц. сеть успешно добавлена');
            } else {
                console.log('error add social link');
                bot.sendMessage(chatId, `Ошибка добавления соц. сети.\nПовторите попытку: /social <Ссылка>`);
            }
        } else {
            console.log('error add social link');
            bot.sendMessage(chatId, 'Ошибка добавления ссылки на соц. сеть. Пользователь не существует');
        }

    } catch (err) {
        console.log(err);
        bot.sendMessage(chatId, 'Ошибка добавления ссылки на соц. сеть. Ошибка БД');
    }
});

bot.onText(/\/prof (.+)/, async(msg, match) =>{
    const chatId = msg.chat.id;
    const resp = match[1];
    console.log(msg);
    try {
        let user = await User.findOne({username: msg.from.username});
        console.log(msg.from.username);
        if (user) {
            console.log('User exist');
            user.social = resp;
            user = await User.findOneAndUpdate(user._id, user, {new: true});
            console.log(user);
            if (user) {
                console.log('add prof is success');
                bot.sendMessage(chatId, 'Специализация успешно добавлена');
            } else {
                console.log('error add prof');
                bot.sendMessage(chatId, `Ошибка добавления специализации.\nПовторите попытку: /prof <Специализация>`);
            }
        } else {
            console.log('error add prof');
            bot.sendMessage(chatId, 'Ошибка добавления специализации. Пользователь не существует');
        }
    } catch (err) {
        console.log(err);
        bot.sendMessage(chatId, 'Ошибка добавления специализации. Ошибка БД');
    }
});

bot.onText(/\/tel (.+)/, async(msg, match) =>{
    const chatId = msg.chat.id;
    const resp = match[1];
    console.log(msg);
    try {
        let user = await User.findOne({username: msg.from.username});
        console.log(msg.from.username);
        if (user) {
            console.log('User exist');
            user.tel = resp;
            user = await User.findOneAndUpdate(user._id, user, {new: true});
            console.log(user);
            if (user) {
                console.log('add tel is success');
                bot.sendMessage(chatId, 'Телефон успешно добавлена');
            } else {
                console.log('error add tel');
                bot.sendMessage(chatId, `Ошибка добавления tелефона.\nПовторите попытку: /tel <Телефон>`);
            }
        } else {
            console.log('error add tel');
            bot.sendMessage(chatId, 'Ошибка добавления телефона. Пользователь не существует');
        }
    } catch (err) {
        console.log(err);
        bot.sendMessage(chatId, 'Ошибка добавления телефона. Ошибка БД');
    }
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
bot.onText(/\/create (.+)/, async(msg, match) => {
    console.log('tournament');
    const chatId = msg.chat.id;
    const resp = match[1];
    const prizes = [
        {
            name: 'pen',
            count: 3
        },
        {
            name: 'cup',
            count: 2
        }
    ];
    const winner_count = 2;
    const tName = 'testttt';
    try {
        let tournament = await Tournament.create({
            name: tName,
            prizes: prizes,
            winner_count: winner_count,
        });
        if (tournament) {
            console.log('tournament create successful');
        } else {
            console.log('error add tournament')
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
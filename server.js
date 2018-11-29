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

const KEYBOARD_COMMAND = '/keyboard';
const KEYBOARD_COMMAND_SHOW = 'show';
const KEYBOARD_COMMAND_HIDE = 'hide';

bot.onText(new RegExp(`${KEYBOARD_COMMAND} (.+)`), (msg, match) => {
// bot.onText(/\/keyboard (.+)/, (msg, match) => {
    const id = msg.chat.id;
    console.log(match[1]);
    switch (match[1]) {
        case KEYBOARD_COMMAND_SHOW:
            bot.sendMessage(id, 'Showing a keyboard', {
                reply_markup: {
                    keyboard: [
                        [
                            `${KEYBOARD_COMMAND} ${KEYBOARD_COMMAND_HIDE}`
                        ]
                    ]
                }
            });
            break;
        case KEYBOARD_COMMAND_HIDE:
            bot.sendMessage(id, 'Hiding a keyboard', {
                reply_markup: {
                    remove_keyboard: true
                }
            })
            break;
        default:
            bot.sendMessage(id, 'Invalid parametrs');
    }
});

bot.onText(/\/echo (.+)/, (msg, match) => {

    const chatId = msg.chat.id;
    const resp = match[1];

    bot.sendMessage(chatId, resp);
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
                username: msg.from.username
            });
            bot.sendMessage(chatId, 'thanks, for register');
        }

    } catch (err) {
        console.log(err);
    }



});

bot.onText(/\/name (.+)/, (msg, match) => {

    const chatId = msg.chat.id;
    const resp = match[1];

    bot.sendMessage(chatId, 'your name is resp');
    bot.sendMessage(chatId, 'enter your email');
});
bot.onText(/\/photo/, function onPhotoText(msg) {
    // From file path
    const photo = `https://www.catster.com/wp-content/uploads/2017/08/Pixiebob-cat.jpg`;
    bot.sendPhoto(msg.chat.id, photo, {
        caption: "I'm a bot!"
    });
});


// Matches /audio
bot.onText(/\/audio/, function onAudioText(msg) {
    // From HTTP request
   try{
       const url = 'http://www.autofish.net/deideis/friends/covered_wagon/cat_cry.wav';
       const audio = request(url);
       bot.sendAudio(msg.chat.id, audio);
   } catch (err) {
       console.log(err);
   }
});
bot.onText(/\/love/, function onLoveText(msg) {
    const opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
            keyboard: [
                ['Yes, you are the bot of my life ❤'],
                ['No, sorry there is another one...']
            ]
        })
    };
    bot.sendMessage(msg.chat.id, 'Do you love me?', opts);
});

bot.onText(/\/editable/, function onEditableText(msg) {
    const opts = {
        reply_markup: {
            keyboard: [
                [
                    {
                        text: 'Edit Text',
                        // we shall check for this value when we listen
                        // for "callback_query"
                        callback_data: 'edit'
                    }
                ]
            ]
        }
    };
    bot.sendMessage(msg.from.id, 'Original Text', opts);
});

bot.on('callback_query', function onCallbackQuery(callbackQuery) {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    const opts = {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
    };
    let text;

    if (action === 'edit') {
        text = 'Edited Text';
    }

    bot.editMessageText(text, opts);
});

// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;
//
//     // send a message to the chat acknowledging receipt of their message
//     bot.sendMessage(chatId, 'Received your message');
//     var photo = 'https://www.catster.com/wp-content/uploads/2017/08/Pixiebob-cat.jpg';
//     bot.sendPhoto(chatId, photo, {caption: 'Милые котята'});
// });
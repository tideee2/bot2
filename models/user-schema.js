let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let user = new Schema({
        firstName: {
            type: String,
            required: false
        },
        lastName: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: false
        },
        id: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        chatId: {
            type: String,
            required: true
        }
    },
    {
        versionKey: false
    });

let schema = mongoose.model('users', user);

module.exports = schema;
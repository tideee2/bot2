let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let tournament = new Schema({
        name: {
            type: String,
            required: true
        },
        prizes: {
            type: Array,
            required: true,
            default: []
        },
        winners: {
            type: Array,
            required: false,
            default: []
        },
        winner_count: {
            type: Number,
            required: false
        }
    },
    {
        versionKey: false
    });

let schema = mongoose.model('tournaments', tournament);

module.exports = schema;
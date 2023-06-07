const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const EventsSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    node: {
        type: Number,
        required: true
    },
    temperature: {
        type: Number,
        required: true
    },
    humidity: {
        type: Number,
        required: true
    },
    co2: {
        type: Number,
        required: true
    },
    pm25: {
        type: Number,
        required: true
    },
    uv: {
        type: Number,
        required: true
    },
    created: {
        type: Date,
        default: moment().utc().add(7, 'hours')
    }
}, {
        _id: false,
        id: false,
        versionKey: false,
        strict: false
    }
);

module.exports = mongoose.model('Event3', EventsSchema, 'test_node3');
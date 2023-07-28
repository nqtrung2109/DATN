const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const EventsSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    node: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    temperature: {
        type: String,
        required: true
    },
    humidity: {
        type: String,
        required: true
    },
    co2: {
        type: String,
        required: true
    },
    pm25: {
        type: String,
        required: true
    },
    uv: {
        type: String,
        required: true
    },
    created: {
        type: String,
        default: () => moment().utc().add(7, 'hours').format('HH:mm:ss DD-MM-YYYY')
    }
}, {
        _id: false,
        id: false,
        versionKey: false,
        strict: false
    }
);

module.exports = mongoose.model('Event1', EventsSchema,'Node_1');
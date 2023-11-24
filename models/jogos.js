const mongoose = require('mongoose');

const JogosSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    classification: {
        type: Number,
        required: true,
        min: 0,
        max: 18
    },
    genre: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    }
});

const Jogos = mongoose.model('Jogos', JogosSchema);

module.exports = Jogos;

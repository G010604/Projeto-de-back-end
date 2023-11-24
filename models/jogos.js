const mongoose = require('mongoose');

const Jogos = mongoose.model('Jogos', { 
    name: String, 
    classification: Number,
    genre: String,
    price: Number,
    description: String
});

module.exports = Jogos;

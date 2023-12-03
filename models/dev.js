const mongoose = require('mongoose');

const DevSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    senha: {
        type: String,
        required: true
    }
});

const Dev = mongoose.model('Dev', DevSchema);

module.exports = Dev;
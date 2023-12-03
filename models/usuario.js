const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
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

const Usuario = mongoose.model('Usuario', UsuarioSchema);

module.exports = Usuario;
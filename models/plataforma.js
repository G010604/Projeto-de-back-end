const mongoose = require('mongoose');

const PlataformaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        unique: true,
    },
    empresa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Empresa',
        required: true,
    },
    jogos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jogos'
    }]
    
});

const Plataforma = mongoose.model('Plataforma', PlataformaSchema);

module.exports = Plataforma;
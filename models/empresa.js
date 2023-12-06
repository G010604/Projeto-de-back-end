const mongoose = require('mongoose');

const EmpresaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        unique: true,
    },
    plataformas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plataforma'
    }]
});

const Empresa = mongoose.model('Empresa', EmpresaSchema);

module.exports = Empresa;

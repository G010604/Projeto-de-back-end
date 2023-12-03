const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Jogos = require('../models/jogos');
const Auth = require('../autenticacao/auth')

const jogosSchema = Joi.object({
    name: Joi.string().required(),
    classification: Joi.number().integer().min(0).max(18).required(),
    genre: Joi.string().required(),
    price: Joi.number().min(0).required(),
    description: Joi.string().required(),
});

router.get("/", async (req, res) => {
    const limite = parseInt(req.query.limite) || 5; 
    const pagina = parseInt(req.query.pagina) || 1; 

    const totalJogos = await Jogos.countDocuments();
    const totalPaginas = Math.ceil(totalJogos / limite);

    const pular = (pagina - 1) * limite;

    const jogos = await Jogos.find().skip(pular).limit(limite);

    res.send({
        jogos,
        paginaAtual: pagina,
        totalPaginas,
        totalJogos
    });
});


// Deletar jogos
router.delete("/:id", Auth.acesso, async (req, res) => {
    const jogos = await Jogos.findByIdAndDelete(req.params.id);

    if (!jogos) {
        return res.status(404).json({ erro: 'Jogo não encontrado' });
    }

    res.send(jogos);
});

// Atualizar jogos
router.put("/:id", Auth.acesso, async (req, res) => {
   
    const { error } = jogosSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ erro: error.details[0].message, message: 'Preencha todos os campos' });
    }

    const jogos = await Jogos.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true
        }
    );

    if (!jogos) {
        return res.status(404).json({ erro: 'Jogo não encontrado' });
    }

    res.send(jogos);
});

// Criar jogos
router.post("/", Auth.acesso, async (req, res) => {
    
    const { error } = jogosSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message, message: 'Preencha todos os campos' });
    }

    const jogos = new Jogos(req.body);

    await jogos.save();
    res.send(jogos);
});

module.exports = router;

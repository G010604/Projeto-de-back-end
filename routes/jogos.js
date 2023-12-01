const express = require('express');
const router = express.Router();
const Jogos = require('../models/jogos');
const Auth = require('../autenticacao/auth')

// Procurar jogos
router.get("/", async (req, res) => {
    const jogos = await Jogos.find();
    res.send(jogos);    
});

// Deletar jogos
router.delete("/:id", Auth.acesso, async (req, res) => { 
    const jogos = await Jogos.findByIdAndDelete(req.params.id);
    res.send(jogos);    
});

// Atualizar jogos
router.put("/:id", Auth.acesso, async (req, res) => {
    const jogos = await Jogos.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            classification: req.body.classification,
            genre: req.body.genre,
            price: req.body.price,
            description: req.body.description
        },
        {
            new: true
        }
    );

    if (!jogos) {
        return res.status(404).json({ error: 'Jogo não encontrado' });
    }

    res.send(jogos);
    
});

// Criar jogos
router.post("/", Auth.acesso, async (req, res) => {
    const { name, classification, genre, price, description } = req.body;

    if (!name || !classification || !genre || !price || !description) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    if (classification > 18 || classification < 5) {
        return res.status(400).json({ error: 'Classificação indicativa inválida' });
    }

    const jogos = new Jogos({
        name,
        classification,
        genre,
        price,
        description
    });

    await jogos.save();
    res.send(jogos);
    
});

module.exports = router;

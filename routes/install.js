const express = require('express');
const router = express.Router();
const Empresa = require('../models/empresa');
const Plataforma = require('../models/plataforma');
const Jogos = require('../models/jogos');
const Dev = require('../models/dev');
require('dotenv').config();

router.get('/', async (req, res) => {
    const empresas = [
      { nome: 'Sony' },
      { nome: 'Microsoft' },
      { nome: 'Nintendo' },
      { nome: 'Apple' },
      { nome: 'Samsung' }
    ];
    const empresasInseridas = await Empresa.insertMany(empresas);

    const plataformas = [
      { nome: 'Playstation 5', empresa: empresasInseridas[0]._id },
      { nome: 'Xbox series X', empresa: empresasInseridas[1]._id },
      { nome: 'Nintendo Switch', empresa: empresasInseridas[2]._id },
      { nome: 'iPhone 15', empresa: empresasInseridas[3]._id },
      { nome: 'Samsung Galaxy S23 5G', empresa: empresasInseridas[4]._id }
    ];
    const plataformasInseridas = await Plataforma.insertMany(plataformas);

    const jogos = [
        { name: 'Demon\'s Souls', classification: 18, genre: 'Ação', price: 69.99, description: 'Remake do clássico', plataforma: [plataformasInseridas[0]._id] },
        { name: 'Halo Infinite', classification: 16, genre: 'Tiro', price: 59.99, description: 'Nova entrada na série Halo', plataforma: [plataformasInseridas[1]._id] },
        { name: 'The Legend of Zelda: Breath of the Wild', classification: 10, genre: 'Aventura', price: 49.99, description: 'Aclamado jogo da série Zelda', plataforma: [plataformasInseridas[2]._id] },
        { name: 'Genshin Impact', classification: 12, genre: 'RPG', price: 0.00, description: 'Jogo de ação em mundo aberto', plataforma: [plataformasInseridas[3]._id] },
        { name: 'Among Us', classification: 10, genre: 'Multijogador', price: 0.00, description: 'Jogo de festa multiplayer', plataforma: [plataformasInseridas[4]._id] },
    ];
    await Jogos.insertMany(jogos);

    const dev = [
      { email: process.env.DEV_PADRAO, senha: process.env.SENHA_DEV_PADRAO }
    ];
    await Dev.insertMany(dev);

    res.send('Banco de dados instalado com sucesso!');
});

module.exports = router;

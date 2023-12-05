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
/*  
    #swagger.parameters['body'] = {
        in: 'body',
            description: 'Atualização de jogos...',
            schema: {
                $name: 'Nome',
                $classification: 18,
                $genre: 'FPS',
                $price: 100,
                $description: 'Um jogo de mundo aberto'
            }
    } 
*/   
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
/*  
    #swagger.parameters['body'] = {
        in: 'body',
            description: 'Criação de jogos...',
            schema: {
                $name: 'Nome',
                $classification: 18,
                $genre: 'FPS',
                $price: 100,
                $description: 'Um jogo de mundo aberto'
            }
    } 
*/
    const { error } = jogosSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message, message: 'Preencha todos os campos' });
    }

    const jogos = new Jogos(req.body);

    await jogos.save();
    res.send(jogos);
});

// Buscar jogos por gênero
router.get("/genero/:genero", async (req, res) => {
    const genero = req.params.genero;

    const regex = new RegExp(genero, 'i');

    const jogosPorGenero = await Jogos.find({ genre: regex });

    if (!jogosPorGenero || jogosPorGenero.length === 0) {
        return res.status(404).json({ erro: 'Nenhum jogo encontrado para o gênero especificado' });
    }

    res.send(jogosPorGenero);
});

// Rota de instalação do banco de dados
router.get("/install", async (req, res) => {
        
    const jogosIniciais = [
        {
            name: 'The Adventure Quest',
            classification: 12,
            genre: 'Ação',
            price: 49.99,
            description: 'Embarque em uma incrível jornada cheia de ação e aventura.'
        },
        {
            name: 'Galactic Conquest',
            classification: 16,
            genre: 'Estratégia',
            price: 39.99,
            description: 'Conquiste a galáxia com suas habilidades estratégicas neste jogo envolvente.'
        },
        {
            name: 'Mystic Legends',
            classification: 18,
            genre: 'RPG',
            price: 59.99,
            description: 'Explore um mundo místico e torne-se uma lenda neste RPG emocionante.'
        },
        {
            name: 'Velocity Racer',
            classification: 12,
            genre: 'Corrida',
            price: 29.99,
            description: 'Acelere sua adrenalina nas corridas mais velozes e emocionantes.'
        },
        {
            name: 'Survival Horizon',
            classification: 18,
            genre: 'Sobrevivência',
            price: 44.99,
            description: 'Teste suas habilidades de sobrevivência em um mundo pós-apocalíptico cheio de desafios.'
        }
    ];

        await Jogos.insertMany(jogosIniciais);

        res.send("Banco de dados instalado com sucesso!");
});


module.exports = router;

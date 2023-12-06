const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Jogos = require('../models/jogos');
const Plataforma = require('../models/plataforma');
const Auth = require('../autenticacao/auth')

const jogosSchema = Joi.object({
    name: Joi.string().required(),
    classification: Joi.number().integer().min(0).max(18).required(),
    genre: Joi.string().required(),
    price: Joi.number().min(0).required(),
    description: Joi.string().required(),
    plataforma: Joi.array().items(Joi.string())
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

    await Plataforma.updateMany(
        { _id: { $in: jogos.plataforma } },
        { $pull: { jogos: jogos._id } }
    );

    // Associar as novas plataformas
    if (req.body.plataforma && req.body.plataforma.length > 0) {
        jogos.plataforma = req.body.plataforma;
        // Atualizar as plataformas associadas
        await Plataforma.updateMany(
            { _id: { $in: req.body.plataforma } },
            { $push: { jogos: jogos._id } }
        );
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

    if (req.body.plataformas && req.body.plataformas.length > 0) {
        jogos.plataformas = req.body.plataformas;
        // Atualizar as plataformas associadas
        await Plataforma.updateMany(
            { _id: { $in: req.body.plataformas } },
            { $push: { jogos: jogos._id } }
        );
    }


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

module.exports = router;
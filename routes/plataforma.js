const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Plataforma = require('../models/plataforma');
const Empresa = require('../models/empresa');
const Auth = require('../autenticacao/auth');

const plataformaSchema = Joi.object({
    nome: Joi.string().required(),
    empresa: Joi.string().required(), 
});

router.get("/", async (req, res) => {
    const limite = parseInt(req.query.limite) || 5;
    const pagina = parseInt(req.query.pagina) || 1;

    try {
        const totalPlat = await Plataforma.countDocuments();
        const totalPaginas = Math.ceil(totalPlat / limite);
        const pular = (pagina - 1) * limite;

        const plat = await Plataforma.find().skip(pular).limit(limite).populate('empresa', 'nome');

        res.send({
            plat,
            paginaAtual: pagina,
            totalPaginas,
            totalPlat
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", Auth.acesso, async (req, res) => {
    const { error } = plataformaSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message, message: 'Preencha todos os campos corretamente' });
    }

    try {
        const novaPlataforma = new Plataforma(req.body);
        await novaPlataforma.save();

        const empresaExistente = await Empresa.findById(req.body.empresa);
        if (empresaExistente) {
            empresaExistente.plataformas.push(novaPlataforma._id);
            await empresaExistente.save();
        }

        res.status(201).send(novaPlataforma);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:id", Auth.acesso, async (req, res) => {
    const { error } = plataformaSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message, message: 'Preencha todos os campos corretamente' });
    }

    try {
        const plataformaAtualizada = await Plataforma.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!plataformaAtualizada) {
            return res.status(404).json({ error: 'Plataforma não encontrada' });
        }

        const empresaExistente = await Empresa.findById(req.body.empresa);
        if (empresaExistente) {
          
            empresaExistente.plataformas.pull(plataformaAtualizada._id);
            await empresaExistente.save();

            empresaExistente.plataformas.push(plataformaAtualizada._id);
            await empresaExistente.save();
        }

        res.send(plataformaAtualizada);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", Auth.acesso, async (req, res) => {
    try {
        const plataformaDeletada = await Plataforma.findByIdAndDelete(req.params.id);

        if (!plataformaDeletada) {
            return res.status(404).json({ error: 'Plataforma não encontrada' });
        }

        const empresaExistente = await Empresa.findById(plataformaDeletada.empresa);
        if (empresaExistente) {
            empresaExistente.plataformas.pull(plataformaDeletada._id);
            await empresaExistente.save();
        }

        res.send(plataformaDeletada);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Buscar plataformas por nome
router.get("/nome/:nome", async (req, res) => {
    const nome = req.params.nome;

    const nomex = new RegExp(nome, 'i');

    const platPorNome = await Plataforma.find({ nome: nomex });

    if (!platPorNome || platPorNome.length === 0) {
        return res.status(404).json({ erro: 'Nenhuma plataforma encontrada' });
    }

    res.send(platPorNome);
});

module.exports = router;

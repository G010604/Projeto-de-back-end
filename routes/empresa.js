const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Empresa = require('../models/empresa');
const Plataforma = require('../models/plataforma'); 
const Auth = require('../autenticacao/auth');

const empresaSchema = Joi.object({
    nome: Joi.string().required(),
});

router.get("/", async (req, res) => {   
    const limite = parseInt(req.query.limite) || 5;
    const pagina = parseInt(req.query.pagina) || 1;

    const totalEmp = await Empresa.countDocuments();
    const totalPaginas = Math.ceil(totalEmp / limite);

    const pular = (pagina - 1) * limite;

    const empresas = await Empresa.find().skip(pular).limit(limite).populate('plataformas', 'nome');
    res.send({
        empresas,
        paginaAtual: pagina,
        totalPaginas,
        totalEmp
    });
});

router.post("/", Auth.acesso, async (req, res) => {
    const { error } = empresaSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message, message: 'Preencha todos os campos corretamente' });
    }

    const novaEmpresa = new Empresa(req.body);
    await novaEmpresa.save();
    res.status(201).send(novaEmpresa);
});

router.put("/:id", Auth.acesso, async (req, res) => {
    const { error } = empresaSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message, message: 'Preencha todos os campos corretamente' });
    }
        
    const empresaAtualizada = await Empresa.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    if (!empresaAtualizada) {
        return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    res.send(empresaAtualizada);
});

router.delete("/:id", Auth.acesso, async (req, res) => {
   
    const empresaDeletada = await Empresa.findByIdAndDelete(req.params.id);

    if (!empresaDeletada) {
        return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    await Plataforma.updateMany(
        { empresa: empresaDeletada._id },
        { $unset: { empresa: "" } }
    );

    res.send(empresaDeletada);
});

// Buscar empresas por nome
router.get("/nome/:nome", async (req, res) => {
    const nome = req.params.nome;

    const nomex = new RegExp(nome, 'i');

    const empPorNome = await Empresa.find({ nome: nomex });

    if (!empPorNome || empPorNome.length === 0) {
        return res.status(404).json({ erro: 'Nenhuma empresa encontrada' });
    }

    res.send(empPorNome);
});

module.exports = router;

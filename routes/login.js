const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
const Dev = require('../models/dev');
require('dotenv').config();

router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    const login = await Usuario.findOne({ email, senha });

        if (!login) {
            return res.status(403).json({ logged: false, mensagem: 'Email ou senha inválidos' });
        }

        const token = jwt.sign({ email: login.email }, process.env.SECRET_KEY_1, { expiresIn: '1 hour' });
        res.json({ logged: true, token: token });
});

router.post('/signup', async (req, res) => {
    const { email, senha } = req.body;

        const usuarioExistente = await Usuario.findOne({ email });

        if (usuarioExistente) {
            return res.status(400).json({ error: 'E-mail já registrado. Tente fazer login.' });
        }
       
        const novoUsuario = new Usuario({
            email,
            senha
        });

        await novoUsuario.save();

        res.json({ mensagem: 'Usuário registrado com sucesso.' });
    
});

router.post('/login/dev', async (req, res) => {
    const { email, senha } = req.body;

    const login = await Dev.findOne({ email, senha });

        if (!login) {
            return res.status(403).json({ logged: false, mensagem: 'Email ou senha inválidos' });
        }

        const token = jwt.sign({ email: login.email }, process.env.SECRET_KEY_2, { expiresIn: '1 hour' });
        res.json({ logged: true, token: token });
});

router.post('/signup/dev', async (req, res) => {
    const { email, senha } = req.body;

        const devExistente = await Dev.findOne({ email });

        if (devExistente) {
            return res.status(400).json({ error: 'E-mail já registrado. Tente fazer login.' });
        }
       
        const novoDev = new Dev({
            email,
            senha
        });

        await novoDev.save();

        res.json({ mensagem: 'Desenvolvedor registrado com sucesso.' });
    
});

module.exports = router;
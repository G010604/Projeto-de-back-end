const express = require('express');
const router = express.Router();
const { validationResult, check } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
const Usuario = require('../../models/usuario');

//Novo usuario
router.post("/signup", [
    check('nome').notEmpty(),
    check('email').isEmail(),
    check('senha').isLength({ min: 6 }),
    check('tipo').isIn(['jogador', 'desenvolvedor'])
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const hashedSenha = await bcrypt.hash(req.body.senha, 10);

        const usuario = new Usuario({
            nome: req.body.nome,
            email: req.body.email,
            senha: hashedSenha,
            tipo: req.body.tipo
        });

        await usuario.save();
        res.send(usuario);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro interno do servidor');
    }
});

//Autenticar usuario
router.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }

        const token = jwt.sign({ id: usuario._id, tipo: usuario.tipo }, 'seuSegredoJWT', { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro interno do servidor');
    }
});

//Criar um desenvolvedor padrao
router.post("/install", async (req, res) => {
    try {
        const hashedSenha = await bcrypt.hash('123321', 10);

        const usuario = new Usuario({
            nome: 'Gustavo Yuusuke Yoshihara',
            email: 'desenvolvedor@padrao.com',
            senha: hashedSenha,
            tipo: 'desenvolvedor'
        });

        await usuario.save();
        res.send(usuario);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro interno do servidor');
    }
});

module.exports = router;
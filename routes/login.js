const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router();

router.post('/login', (req, res) => {
    const {usuario, senha} = req.body

    if (!usuario || !senha) {
        return res.status(400).json({ logged: false, mensagem: 'Usuário e senha são obrigatórios' });
    }

    if(senha == usuario){
        const token = jwt.sign({usuario: usuario}, 'twq22222', {expiresIn: '1 hour'})
        res.json({logged: true, token: token})
    }
    else{
        res.status(403).json({logged: false, mensagem: 'Usuário ou senha inválidos'})
    }
})

module.exports = router;
const jwt = require('jsonwebtoken');

module.exports = {
    acesso: (req, res, next) => {
        const beartoken = req.headers['authorization'] || "";
        let token = beartoken.split(" ");

        if (token[0] === 'Bearer') {
            token = token[1];
        }

        console.log(token);

        jwt.verify(token, 'twq22222', (err, obj) => {
            if (err) {
                return res.status(403).json({ mensagem: "Token inválido" });
            } else {
                req.usuario = obj.usuario;
                next();
            }
        });
    }
};


const jwt = require('jsonwebtoken');

module.exports = {
    acesso: (req, res, next) => {
        const beartoken = req.headers['authorization'] || "";
        let token = beartoken.split(" ");

        if (token[0] === 'Bearer') {
            authtoken = token[1];
        }

        console.log(authtoken);

        jwt.verify(authtoken, 'twq22222', (err, obj) => {
            if (err) {
                return res.status(403).json({ mensagem: "Token inválido" });
            } else {
                req.dev = obj.dev;
                next();
            }
        });
    }
};


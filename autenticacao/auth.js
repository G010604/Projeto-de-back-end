const jwt = require('jsonwebtoken');
require('dotenv').config();


module.exports = {
    acesso: (req, res, next) => {
        const beartoken = req.headers['authorization'] || "";
        let token = beartoken.split(" ");

        if (token[0] === 'Bearer') {
            authtoken = token[1];
        }

        console.log(authtoken);

        jwt.verify(authtoken, process.env.SECRET_KEY_2, (err, obj) => {
            if (err) {
                return res.status(403).json({ mensagem: "Você não tem autorização para utilizar esta função" });
            } else {
                req.dev = obj.dev;
                next();
            }
        });
    }
};


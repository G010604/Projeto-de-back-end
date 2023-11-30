const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, 'seuSegredoJWT');
        
        if (decoded.tipo !== 'desenvolvedor') {
            return res.status(403).json({ error: 'Acesso não autorizado' });
        }

        req.usuario = decoded;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Token inválido' });
    }
};

module.exports = authMiddleware;
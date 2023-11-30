const errorMiddleware = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  };
  
  module.exports = errorMiddleware;
  
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
const errorMiddleware = require('./middleware/errorMiddleware');

const jogosRoutes = require('./routes/jogos.js');
const usuarioRoutes = require('./routes/usuario.js');

const app = express();

app.use(bodyParser.json());

app.use('/jogos', jogosRoutes);

app.use('/usuario', usuarioRoutes);

app.use(errorMiddleware);

app.listen(config.port, () => {
  console.log(`App running...`);
});

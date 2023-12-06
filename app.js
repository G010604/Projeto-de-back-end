const express = require('express');
const mongoose = require('mongoose');
const jogosRoutes = require('./routes/jogos.js');
const loginRoutes = require('./routes/login.js');
const platRoutes = require('./routes/plataforma.js');
const empRoutes = require('./routes/empresa.js');
const installRoutes = require('./routes/install.js');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./docs.json');

const app = express();

app.use(express.json());


app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use('/jogos', jogosRoutes);
app.use('/', loginRoutes);
app.use('/plataforma', platRoutes);
app.use('/empresa', empRoutes);
app.use('/install', installRoutes);


app.listen(3000, () => {
    mongoose.connect(process.env.MONGO_KEY_ACCESS);
    console.log('App running...');
});
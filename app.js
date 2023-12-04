const express = require('express');
const mongoose = require('mongoose');
const jogosRoutes = require('./routes/jogos.js');
const loginRoutes = require('./routes/login.js');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./docs.json');

const app = express();

app.use(express.json());


app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use('/jogos', jogosRoutes);
app.use('/', loginRoutes);


app.listen(3000, () => {
    mongoose.connect(process.env.MONGO_KEY_ACCESS);
    console.log('App running...');
});
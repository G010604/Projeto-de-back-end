const express = require('express');
const mongoose = require('mongoose');
const jogosRoutes = require('./routes/jogos.js');
const loginRoutes = require('./routes/login.js');

const app = express();

app.use(express.json());

app.use('/jogos', jogosRoutes);
app.use('/', loginRoutes);

app.listen(3000, () => {
    mongoose.connect('mongodb+srv://guyuusuke:twq22222@videogames.owmvyts.mongodb.net/?retryWrites=true&w=majority')
    console.log(`App running...`);
});

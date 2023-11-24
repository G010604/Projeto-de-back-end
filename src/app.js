const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/', routes);

mongoose.connect('mongodb+srv://guyuusuke:twq22222@videogames.owmvyts.mongodb.net/?retryWrites=true&w=majority');

app.listen(port, () => {
    console.log('App running');
});

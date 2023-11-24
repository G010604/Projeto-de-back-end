const express = require('express')
const mongoose = require('mongoose');
const Jogos = require('../models/jogos')

const app = express()
app.use(express.json())
const port = 3000

app.get("/", async (req, res) => {
    const jogos = await Jogos.find()
    res.send(jogos)
})

app.delete("/:id", async (req, res) =>{
    const jogos = await Jogos.findByIdAndDelete(req.params.id)
    res.send(jogos)
})

app.put("/:id", async (req, res) =>{
    const jogos = await Jogos.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        classification: req.body.classification,
        genre: req.body.genre,
        price: req.body.price,
        description: req.body.description
    }, {
        new: true
    })

    res.send(jogos)
})

app.post("/", async (req, res) => {
    const jogos = new Jogos({
        name: req.body.name,
        classification: req.body.classification,
        genre: req.body.genre,
        price: req.body.price,
        description: req.body.description
    })

    await jogos.save()
    res.send(jogos)
})

app.listen(port, () => {
    mongoose.connect('mongodb+srv://guyuusuke:twq22222@videogames.owmvyts.mongodb.net/?retryWrites=true&w=majority');
    console.log('App running')
})
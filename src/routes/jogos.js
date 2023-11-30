const express = require('express');
const router = express.Router();
const { validationResult, check } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const Jogos = require('../../models/jogos');

//Procurar jogos
router.get("/", async (req, res) => {
    const jogos = await Jogos.find()
    res.send(jogos);   
});

//Deletar jogos
router.delete("/:id", authMiddleware, async (req, res) => {
    const jogos = await Jogos.findByIdAndDelete(req.params.id);
    res.send(jogos);
});

//Atualizar jogos
router.put("/:id", authMiddleware, [
    check('name').optional().notEmpty(),
    check('classification').optional().isInt({ min: 0, max: 18 }),
    check('genre').optional().notEmpty(),
    check('price').optional().isFloat({ min: 0 }),
    check('description').optional().notEmpty()
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const jogos = await Jogos.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                classification: req.body.classification,
                genre: req.body.genre,
                price: req.body.price,
                description: req.body.description
            },
            {
                new: true
            }
        );

        if (!jogos) {
            return res.status(404).json({ error: 'Jogo não encontrado' });
        }

        res.send(jogos);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro interno do servidor');
    }
});

//Criar jogos
router.post("/", authMiddleware, [
    check('name').notEmpty(),
    check('classification').isInt({ min: 0, max: 18 }),
    check('genre').notEmpty(),
    check('price').isFloat({ min: 0 }),
    check('description').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const jogos = new Jogos({
        name: req.body.name,
        classification: req.body.classification,
        genre: req.body.genre,
        price: req.body.price,
        description: req.body.description
    });

    try {
        await jogos.save();
        res.send(jogos);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro interno do servidor');
    }
});

module.exports = router;
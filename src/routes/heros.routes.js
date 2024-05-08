const express = require('express');
const router = express.Router();
const heroesController = require('../controllers/heroesController');

app.get('/heroes', heroesController.getAllHeroes);
app.get('/heroes', heroesController.getHeroByName);
app.post('/heroes', heroesController.createHeroes);
app.put('/heroes/:id', heroesController.updateHero);
app.delete('/heroes/:id', heroesController.deleteHero);

module.exports = router;
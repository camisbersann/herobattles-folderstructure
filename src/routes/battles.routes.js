const express = require('express');
const router = express.Router();
const battlesController = require('../controllers/battlesController');


app.get('/battles', battlesController.getAllBattles);
app.get('/heroes', battlesController.getBattlesByHeroName);
app.get('/battles/:hero1_id/:hero2_id', battlesController.battles);
app.delete('/heroes/:id', battlesController.deleteBattles);

module.exports = router;
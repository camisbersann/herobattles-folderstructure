require('dotenv').config();
const express = require('express');
const heroRoutes = require('./src/routes/heros.routes');
const battlesRoutes = require('./src/routes/battles.routes');

const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());

app.use('/', heroRoutes);
app.use('/', battlesRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
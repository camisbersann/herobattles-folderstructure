const express = require('express');

async function createHeroes(req, res){
    try {
        const { name, power, strenght } = req.body;

        await pool.query('INSERT INTO heroes (name, power, strenght) VALUES ($1, $2, $3)', [name, power, strenght]);
        res.status(201).send({ mensagem: 'Herói criado com sucesso!' });
    } catch (error) {
        console.error('Erro ao criar herói', error);
        res.status(500).json({ message: 'Erro ao criar herói' });
    }
}

async function getAllHeroes(req, res){
    try {
        const result = await pool.query('SELECT * FROM heroes');
        res.json({
            total: result.rowCount,
            heroes: result.rows,
        });
    } catch (error) {
        console.error('Erro ao obter todos os heróis', error);
        res.status(500).send('Erro ao obter todos os heróis');
    }
}

async function getHeroByName(req, res){
    try {
        const { filter } = req.params;

        if (isNaN(req.params.filter)) {
            const result = await pool.query('SELECT * FROM heroes WHERE name LIKE $1', [`%${filter}%`]);
            res.status(200).json(result.rows[0]);
        } else {
            const result = await pool.query('SELECT * FROM heroes WHERE  = $1', [filter]);
            res.status(200).json(result.rows[0]);
        }
    } catch (error) {
        console.error('Erro ao obter herói pelo nome', error);
        res.status(500).send('Erro ao obter herói pelo nome');
    }
}

async function updateHero(req, res){
    try {
        const { id } = req.params;
        const { name, power, strenght } = req.body;

        await pool.query('UPDATE heroes SET name = $1, power = $2, strenght = $3 WHERE id = $4', [name, power, strenght, id]);
        res.status(201).send({ mensagem: 'Herói atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar herói', error);
        res.status(500).send('Erro ao atualizar herói');
    }
}

async function deleteHero(req, res){
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM heroes WHERE id = $1', [id]);
        res.status(200).send({ mensagem: 'Herói deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar herói', error);
        res.status(500).send('Erro ao deletar herói');
    }
}

module.exports = { createHeroes, getAllHeroes, getHeroByName, updateHero, deleteHero };
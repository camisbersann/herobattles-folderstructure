const pool = require('../config/dbConfig');

async function getAllBattles(req, res){
    try {
        const result = await pool.query(`SELECT battles.id AS numero_batalha, 
        battles.hero1_id AS id_heroi1, 
        battles.hero2_id AS id_heroi2, 
        battles.winner AS vencedor, 
        heroes.name, 
        heroes.power, 
        heroes.strenght,
        heroes.name,
        heroes.power,
        heroes.strenght
        FROM battles 
        LEFT JOIN 
        heroes ON battles.hero1_id = heroes.id OR battles.hero2_id = heroes.id`)
        res.json({
            total: result.rowCount,
            battles: result.rows,
        });
    } catch (error) {
        console.error('Erro ao obter todas as batalhas', error);
        res.status(500).send('Erro ao obter todas as batalhas');
    }
}

async function getBattlesByHeroName(req,res){
    try {
        const { filter } = req.params;

        if (isNaN(req.params.filter)) {
            const result = await pool.query(`SELECT 
            heroes.id,
            heroes.name,
            heroes.power,
            heroes.strenght,
            COUNT(battles.id) AS total_batalhas
        FROM 
            heroes
        LEFT JOIN 
            battles ON heroes.id = battles.hero1_id OR heroes.id = battles.hero2_id
        WHERE 
            heroes.name LIKE $1
            GROUP BY 
    heroes.id, heroes.name, heroes.power, heroes.strenght`, [`%${filter}%`]);
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

async function battles(req, res){
    try {
        const { hero1_id, hero2_id } = req.params;

        // Obter dados dos heróis
        const result1 = await pool.query('SELECT * FROM heroes WHERE id = $1', [hero1_id]);
        const result2 = await pool.query('SELECT * FROM heroes WHERE id = $1', [hero2_id]);

        const h1 = result1.rows[0];
        const h2 = result2.rows[0];

        let winner = -1;

        if (h1.strenght > h2.strenght) {
            winner = h1.id;
        } else if (h2.strenght > h1.strenght) {
            winner = h2.id;
        }

        // Inserir dados da batalha na tabela de batalhas
        const battleInsertQuery = 'INSERT INTO battles (hero1_id, hero2_id, winner) VALUES ($1, $2, $3) RETURNING id';
        const battleResult = await pool.query(battleInsertQuery, [hero1_id, hero2_id, winner]);

        let winnerInfo;
        if (winner != -1) {
            const winnerResult = await pool.query('SELECT * FROM heroes WHERE id = $1', [winner]);
            winnerInfo = winnerResult.rows[0];
        }

        res.json({ winner: winner == -1 ? 'Empate' : winner, battle_id: battleResult.rows[0].id });
    } catch (error) {
        console.error('Erro ao batalhar', error);
        res.status(500).json({ message: 'Erro ao batalhar' });
    }
}

async function deleteBattles(req, res){
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM battles WHERE id = $1', [id]);
        res.status(200).send({ mensagem: 'batalha deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar batalha', error);
        res.status(500).send('Erro ao deletar batalha');
    }
}

module.exports = { getAllBattles, getBattlesByHeroName, battles, deleteBattles };
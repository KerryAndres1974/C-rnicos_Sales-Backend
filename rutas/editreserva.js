const router = require("express").Router();
const pool = require('../database');

router.put('/:idreserva', async (req, res) => {

    const id = req.params.idreserva;
  
    try {
        const query = `UPDATE reservas 
            SET estado = 'completo' WHERE idreserva = $1`;
        const result = await pool.query(query, [id]);
    
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'reserva no encontrada' });
        }
    
        res.json(result.rows);
  
    } catch (error) {
        console.error('Error al obtener la reserva:', error);
        res.status(500).json({ error: 'Error al obtener la reserva' });
    }
});

module.exports = router;
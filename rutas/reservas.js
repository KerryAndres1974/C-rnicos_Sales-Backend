const router = require("express").Router()
const pool = require('../database')

router.get("/", async (req, res) => {
  
    try {
        // Consulta SQL para obtener las reservas
        const query = 'SELECT * FROM reservas';
            
        // Ejecutar la consutla
        const reservas = await pool.query(query);
    
        // Envía la respuesta con las reservas encontrados
        res.json(reservas.rows);
    
    } catch (error) {
        console.error('Error al obtener las reservas:', error);
        res.status(500).json({ error: 'Error al obtener reservas' });
    }
  
});

module.exports = router;
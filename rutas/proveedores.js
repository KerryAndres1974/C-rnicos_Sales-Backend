const router = require("express").Router()
const pool = require('../database')

router.get("/", async (req, res) => {
  
    try {
        // Consulta SQL para obtener los proveedores
        const query = 'SELECT * FROM proveedor';
            
        // Ejecutar la consutla
        const proveedores = await pool.query(query);
    
        // Envía la respuesta con los proveedores encontrados
        res.json(proveedores.rows);
    
    } catch (error) {
        console.error('Error al obtener proveedores:', error);
        res.status(500).json({ error: 'Error al obtener proveedores' });
    }
  
});

module.exports = router;
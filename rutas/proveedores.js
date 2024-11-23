const router = require("express").Router()
const pool = require('../database')

// Crear un nuevo proveedor
router.post("/", async (req, res) => {
    const { nit, nombre, telefono, direccion, tipo } = req.body;
  
    if (!nit || !nombre || !telefono || !direccion || !tipo) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
  
    try {
        const query = `INSERT INTO proveedor (idproveedor, numerotelefono,
        direccion, nombreproveedor, tipoproducto) values ($1, $2, $3, $4, $5)
        RETURNING *`;

        const provider = await pool.query(query, [nit, telefono, direccion, nombre, tipo]);
  
        res.status(201).json(provider.rows[0]);
  
    } catch (error) {
        console.error('Error al agregar el proveedor:', error);
        res.status(500).json({ error: 'Error al agregar al proveedor' });
    }
});

// Obtener todos los proveedores
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
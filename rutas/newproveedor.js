const router = require("express").Router()
const pool = require('../database')

router.post("/", async (req, res) => {
    const { nit, nombre, telefono, direccion, tipo } = req.body;
  
    if (!nit || !nombre || !telefono || !direccion || !tipo) {
        return res.status(400).json({ error: 'Faltan campos requeridos' })
    }
  
    try {
        const query = `INSERT INTO proveedor (idproveedor, numerotelefono,
        direccion, nombreproveedor, tipoproducto) values ($1, $2, $3, $4, $5)
        RETURNING *`;

        const provider = await pool.query(query, [nit, telefono, direccion, nombre, tipo])
  
        res.status(201).json(provider.rows[0])
  
    } catch (error) {
        console.error('Error al agregar el proveedor:', error)
        res.status(500).json({ error: 'Error al agregar al proveedor' })
    }
})

module.exports = router
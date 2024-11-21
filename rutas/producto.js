const router = require("express").Router()
const pool = require('../database')

router.get('/:idproducto', async (req, res) => {

    const id = req.params.idproducto
  
    try {
        const query = `SELECT * FROM inventario WHERE idproducto = $1 AND activo = true`
        const result = await pool.query(query, [id])
    
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Producto no encontrado' });
        }
    
        res.json(result.rows)
  
    } catch (error) {
        console.error('Error al obtener el producto:', error)
        res.status(500).json({ error: 'Error al obtener el producto' })
    }
});

module.exports = router;
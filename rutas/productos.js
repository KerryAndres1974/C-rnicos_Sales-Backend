const router = require("express").Router();
const pool = require('../database');

router.post("/", async (req, res) => {
    const { nombreproducto, tipoproducto } = req.body; // Leer los parámetros de búsqueda

    try {
        // Construir la consulta SQL con condiciones opcionales
        let query = 'SELECT * FROM inventario';
        const conditions = [];
        const values = [];

        // Verificar si se proporciona `nombreproducto` y añadirlo a las condiciones
        if (nombreproducto) {
            conditions.push(`nombreproducto ILIKE $${conditions.length + 1}`);
            values.push(`%${nombreproducto}%`); // Añadir el valor con comodines
        }

        // Verificar si se proporciona `tipoproducto` y añadirlo a las condiciones
        if (tipoproducto) {
            conditions.push(`tipoproducto ILIKE $${conditions.length + 1}`);
            values.push(`%${tipoproducto}%`); // Añadir el valor con comodines
        }

        // Si existen condiciones, agregarlas a la consulta SQL
        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        // Ejecutar la consulta con los valores
        const productos = await pool.query(query, values);

        // Enviar la respuesta con los productos encontrados
        res.json(productos.rows);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

module.exports = router;
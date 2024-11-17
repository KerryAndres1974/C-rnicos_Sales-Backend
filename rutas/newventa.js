const router = require("express").Router();
const pool = require('../database');

router.post("/", async (req, res) => {
    const { id, nombreempleado, totalventa, fecha, producto } = req.body;
    
    try {

        const query = `INSERT INTO ventas (idventa, nombreempleado, totalventa, fecha, producto)
            VALUES ($1, $2, $3, $4, $5::json) RETURNING *`;

        const reserva = await pool.query(query, [id, nombreempleado, totalventa, fecha, JSON.stringify(producto)]);

        for (const item of producto) {
            const { id, cantidad } = item;
            await pool.query(
                `UPDATE inventario 
                SET cantidadxlibra = CAST(cantidadxlibra AS integer) - $1 
                WHERE idproducto = $2 AND CAST(cantidadxlibra AS integer) >= $1`,
                [cantidad, parseInt(id, 10)]
            );
        }

        res.status(201).json(reserva.rows[0]);

    } catch (error) {
        console.error('Error al guardar venta:', error);
        res.status(500).json({ error: 'Error al guardar venta' });
    }
});

module.exports = router;
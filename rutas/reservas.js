const router = require("express").Router();
const pool = require('../database');

router.post("/", async (req, res) => {
    const { id, fecha, producto, valor } = req.body;

    try {

        const query = `INSERT INTO reservas (idreserva, fecha, productos, valor)
            VALUES ($1, $2, $3::json, $4) RETURNING *`;

        const reserva = await pool.query(query, [id, fecha, JSON.stringify(producto), valor]);

        for (const item of producto) {
            const { idproducto, cantidad } = item;
            await pool.query(
                `UPDATE inventario 
                SET cantidadxlibra = CAST(cantidadxlibra AS integer) - $1 
                WHERE idproducto = $2 AND CAST(cantidadxlibra AS integer) >= $1`,
                [parseInt(cantidad, 10), idproducto]
            );
        }

        res.status(201).json(reserva.rows[0]);

    } catch (error) {
        console.error('Error al reservar productos:', error);
        res.status(500).json({ error: 'Error al reservar productos' });
    }
});

module.exports = router;
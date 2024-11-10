const router = require("express").Router();
const pool = require('../database');

router.post("/", async (req, res) => {
    const { id, nombreempleado, totalventa, fecha, producto } = req.body;
    
    try {

        const query = `INSERT INTO ventas (idventa, nombreempleado, totalventa, fecha, producto)
            VALUES ($1, $2, $3, $4, $5::json) RETURNING *`;

        const reserva = await pool.query(query, [id, nombreempleado, totalventa, fecha, JSON.stringify(producto)]);

        let actualizacion = true;
        for (const item of producto) {
            const { idproducto, cantidad } = item;
            const resultado = await pool.query(
                `UPDATE inventario 
                SET cantidadxlibra = CAST(cantidadxlibra AS integer) - $1 
                WHERE idproducto = $2 AND CAST(cantidadxlibra AS integer) >= $1`,
                [parseInt(cantidad, 10), idproducto]
            );

            // Verificar si se actualizó el inventario
            if (resultado.rowCount === 0) {
                console.log(`No se pudo actualizar el inventario para el producto con ID: ${idproducto}. Cantidad insuficiente o error.`);
                actualizacion = false;
            } else {
                console.log(`Inventario actualizado para el producto con ID: ${idproducto}. Cantidad restada: ${cantidad}`);
            }
        }

        // Mensaje final sobre el estado general
        if (actualizacion) {
            console.log("Todos los productos reservados fueron actualizados correctamente en el inventario.");
        } else {
            console.log("Algunos productos no pudieron ser actualizados en el inventario debido a cantidades insuficientes.");
        }

        res.status(201).json(reserva.rows[0]);

    } catch (error) {
        console.error('Error al guardar venta:', error);
        res.status(500).json({ error: 'Error al guardar venta' });
    }
});

module.exports = router;
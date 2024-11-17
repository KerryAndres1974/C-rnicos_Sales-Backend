const router = require("express").Router();
const pool = require('../database');

router.post("/", async (req, res) => {
    const { reserva, cliente } = req.body;
    console.log(reserva, '\n', cliente);
    const { id, fecha, producto, valor } = reserva;
    const { cor, nom, dir, tel } = cliente;
    
    try {
        // Verificamos si el cliente ya ha realizado compras
        const querEmail = 'SELECT id FROM clientedom WHERE correo = $1';
        const existeEmail = await pool.query(querEmail, [cor]);
        let idcliente;
    
        if (existeEmail.rows.length > 0) {
            // actualiza el cliente existente
            const queryCliente = `UPDATE clientedom 
                SET nombre = $1, direccion = $2, telefono = $3
                WHERE correo = $4 RETURNING id`;

            const cliente = await pool.query(queryCliente, [nom, dir, tel, cor]);
            idcliente = cliente.rows[0]?.id;
        } else {
            // Inserta al nuevo cliente
            const queryCliente = `INSERT INTO clientedom (correo, nombre, direccion, telefono)
                VALUES ($1, $2, $3, $4) RETURNING id`;

            const cliente = await pool.query(queryCliente, [cor, nom, dir, tel]);
            idcliente = cliente.rows[0]?.id;
        }

        // Inserta reserva
        const queryReserva = `INSERT INTO reservas (idreserva, fecha, productos, valor, idcliente)
            VALUES ($1, $2, $3::json, $4, $5) RETURNING *`;

        const reserva = await pool.query(queryReserva, [id, fecha, JSON.stringify(producto), valor, idcliente]);

        // Actualiza el inventario
        for (const item of producto) {
            const { idproducto, cantidad } = item;
            await pool.query(
                `UPDATE inventario 
                SET cantidadxlibra = CAST(cantidadxlibra AS integer) - $1 
                WHERE idproducto = $2 AND CAST(cantidadxlibra AS integer) >= $1`,
                [parseInt(cantidad, 10), idproducto]
            );
        }

        res.status(201).json({ cliente: idcliente, reserva: reserva.rows[0] });

    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
});

module.exports = router;
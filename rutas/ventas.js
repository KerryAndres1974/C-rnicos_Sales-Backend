const router = require("express").Router();
const pool = require('../database');

// Crear una nueva venta
router.post('/', async (req, res) => {
    const { venta, cliente } = req.body;
    const { cor, nom, dir, tel } = cliente;
    const { id, idempleado, totalventa, fecha, producto } = venta;
    
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
            const queryCliente = `INSERT INTO clientedom (nombre, direccion, telefono, correo)
                VALUES ($1, $2, $3, $4) RETURNING id`;

            const cliente = await pool.query(queryCliente, [nom, dir, tel, cor]);
            idcliente = cliente.rows[0]?.id;
        }

        const query = `INSERT INTO venta (idventa, idvendedor, valor, fecha, producto, idcliente)
            VALUES ($1, $2, $3, $4, $5::json, $6)`;

        await pool.query(query, [id, idempleado, totalventa, fecha, JSON.stringify(producto), idcliente]);

        for (const item of producto) {
            const { idp, cantidad } = item;
            await pool.query(
                `UPDATE inventario 
                SET cantidadxlibra = cantidadxlibra - $1 
                WHERE idproducto = $2 AND cantidadxlibra >= $1`,
                [cantidad, idp]
            );
        }

        res.status(200).json({ message: 'Venta añadida con exito' });

    } catch (error) {
        console.error('Error al guardar venta:', error);
        res.status(500).json({ error: 'Error al guardar venta' });
    }
});

// Obtener todas las ventas
router.get('/', async (req, res) => {

    try {
        // Consulta SQL para obtener las ventas
        const query = `SELECT idventa AS id, fecha, producto, idvendedor,
                valor AS valor_compra
                FROM venta

            UNION ALL

            SELECT idreserva AS id, fecha, producto, NULL AS idvendedor,
                valor AS valor_compra
                FROM reserva WHERE estado = 'completo'`;

        // Ejecuta la consulta
        const ventas = await pool.query(query);

        // Envia la respuesta con las ventas encontradas
        res.json(ventas.rows);

    } catch (err) {
        console.error('Error al obtener las ventas:', err);
        res.status(500).json({ error: 'Error al obtener ventas' });
    }
});

// Obteber todos los clientes
router.get('/clientes', async (req, res) => {

    try {
        // Consulta SQL para traer los clientes y ejecuta la consulta
        const clientes = await pool.query(`SELECT * FROM clientedom`);

        // Envia la respuesta con las ventas encontradas
        res.json(clientes.rows);

    } catch (err) {
        console.error('Error al obtener los clientes:', err);
        res.status(500).json({ error: 'Error al obtener clientes' });
    }
});

module.exports = router;
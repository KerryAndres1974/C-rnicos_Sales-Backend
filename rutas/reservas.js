const router = require("express").Router();
const pool = require('../database');

// Crear una nueva reserva
router.post('/', async (req, res) => {
    const { reserva, cliente, domicilio } = req.body;
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
            const queryCliente = `INSERT INTO clientedom (nombre, direccion, telefono, correo)
                VALUES ($1, $2, $3, $4) RETURNING id`;

            const cliente = await pool.query(queryCliente, [nom, dir, tel, cor]);
            idcliente = cliente.rows[0]?.id;
        }

        // Inserta reserva
        const queryReserva = `
            INSERT INTO reserva (idreserva, fecha, producto, valor, idcliente, domicilio)
            VALUES ($1, $2, $3::json, $4, $5, $6)`;

        await pool.query(queryReserva, [id, fecha, JSON.stringify(producto), valor, idcliente, domicilio]);

        // Actualiza el inventario
        for (const item of producto) {
            const { idp, cantidad } = item;
            await pool.query(
                `UPDATE inventario 
                SET cantidadxlibra = cantidadxlibra - $1 
                WHERE idproducto = $2 AND cantidadxlibra >= $1`,
                [cantidad, idp]
            );
        }

        res.status(200).json({ message: 'Reserva añadida con exito' });

    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
});

// Obtener todas las reservas pendientes
router.get('/', async (req, res) => {
  
    try {
        // Consulta SQL para obtener las reservas
        const query = `SELECT * FROM reserva WHERE estado = 'pendiente' ORDER BY domicilio DESC`;
            
        // Ejecutar la consutla
        const reservas = await pool.query(query);
    
        // Envía la respuesta con las reservas encontrados
        res.json(reservas.rows);
    
    } catch (error) {
        console.error('Error al obtener las reservas:', error);
        res.status(500).json({ error: 'Error al obtener reservas' });
    }
  
});

// Actualizar estado de una reserva existente
router.put('/:idreserva', async (req, res) => {

    const id = req.params.idreserva;
  
    try {
        const query = `UPDATE reserva 
            SET estado = 'completo' WHERE idreserva = $1`;
        const result = await pool.query(query, [id]);
    
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'reserva no encontrada' });
        }
    
        res.json(result.rows);
  
    } catch (error) {
        console.error('Error al obtener la reserva:', error);
        res.status(500).json({ error: 'Error al obtener la reserva' });
    }
});

module.exports = router;
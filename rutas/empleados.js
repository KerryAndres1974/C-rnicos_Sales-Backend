const router = require("express").Router();
const pool = require('../database');
const bcrypt = require('bcrypt');

// Registro empleados
router.post('/', async (req, res) => {
    
    const { nombre, correo, pass, tel } = req.body;

    const queryEmail = 'SELECT * FROM empleado WHERE correo = $1';
    const existeEmail = await pool.query(queryEmail, [correo]);

    if (existeEmail.rows.length > 0) {
        return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
    }

    // Hashea la contraseña antes de almacenarla en la base de datos
    const hashedPassword = await bcrypt.hash(pass, 10);

    try {
        const query = `INSERT INTO empleado (nombre, correo, telefono, contraseña)
                        VALUES ($1, $2, $3, $4) RETURNING *`;

        const usuario = await pool.query(query, [nombre, correo, tel, hashedPassword]);

        res.status(201).json(usuario.rows[0]);

    } catch (err) {
        console.error('Error al agregar al nuevo empleado:', err);
        res.status(500).json({ err: 'Error al agregar al empleado'});
    }

});

// Obtener empleados
router.get('/', async (req, res) => {

    try {
        const empleados = await pool.query('SELECT * FROM empleado');

        res.json(empleados.rows);
    } catch (err) {
        console.error('Error al obtener empleados:', err);
        res.status(500).json({ error: 'Error al obtener empleados' });
    }
});

// Actualizar empleado
router.put('/:idempleado', async (req, res) => {
    const idempleado = req.params.idempleado;
    const { contrato } = req.body;

    try {
        const queryE = 'SELECT * FROM empleado WHERE id = $1';
        const empleado = await pool.query(queryE, [idempleado]);

        if (empleado.rowCount === 0) {
            return res.status(400).json({ message: 'Usuario no contratado' });
        }

        const query = `UPDATE empleado SET contrato = $1 WHERE id = $2`;
        await pool.query(query, [contrato, idempleado]);

        res.json({ message: 'Empleado editado' });

    } catch (err) {
        console.error('Error al obtener empleado:', err);
        res.status(500).json({ error: 'Error al obtener empleado' });
    }
});

module.exports = router;
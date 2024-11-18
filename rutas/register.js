const router = require("express").Router();
const pool = require('../database');
const bcrypt = require('bcrypt');

router.post("/", async (req, res) => {
    
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

module.exports = router;
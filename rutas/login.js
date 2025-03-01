const router = require("express").Router();
const pool = require('../database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Ingresar 
router.post("/", async (req, res) => { 
    
    const { email, password } = req.body;

    try {
        const query = 'SELECT * FROM empleado WHERE nombre = $1 AND contrato = true';
        const user = await pool.query(query, [email]);

        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Usuario no contratado' });
        }

        const passwordMatch = await bcrypt.compare(password, user.rows[0].contraseña);

        if (!passwordMatch){
            console.log('Contraseña incorrecta para el usuario:', email);
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(user.rows[0], 'your-secret-key', { expiresIn: '1h' });
        res.json({ message: 'Inicio de sesión exitoso', token });

    } catch (error) {
        console.error('Error al iniciar sesión', error);
        res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
});

module.exports = router;
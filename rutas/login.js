const pool = require('../database')
const router = require("express").Router()
const jwt = require('jsonwebtoken')

router.post("/", async (req, res) => { 
    
    const { email, password } = req.body;

    try {
        const user = await pool.query('SELECT * FROM empleado WHERE cargo = $1 OR nombre = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        if (password !== user.rows[0].idempleado){
            console.log('Contraseña incorrecta para el usuario:', email);
        }

        const token = jwt.sign(user.rows[0], 'your-secret-key', { expiresIn: '1h' });
        res.json({ message: 'Inicio de sesión exitoso', token });

    } catch (error) {
        console.error('Error al iniciar sesión', error);
        res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
});

module.exports = router;
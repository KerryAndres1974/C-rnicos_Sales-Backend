const router = require("express").Router()
const pool = require('../database')

// Crear un nuevo proveedor
router.post("/", async (req, res) => {
    const { nit, nombre, telefono, direccion, tipo } = req.body;
  
    try {

        const query = `INSERT INTO proveedor (idproveedor, telefono,
        direccion, nombre, tipoproducto) values ($1, $2, $3, $4, $5)`;

        const provider = await pool.query(query, [nit, telefono, direccion, nombre, tipo]);
  
        res.status(200).json({ message: 'Proveedor añadido con exito' });
  
    } catch (error) {
        console.error('Error al agregar el proveedor:', error);
        res.status(500).json({ error: 'Error al agregar al proveedor' });
    }
});

// Obtener todos los proveedores
router.get("/", async (req, res) => {
  
    try {
        // Consulta SQL para obtener los proveedores
        const query = 'SELECT * FROM proveedor WHERE activo = true';
            
        // Ejecutar la consutla
        const proveedores = await pool.query(query);
    
        // Envía la respuesta con los proveedores encontrados
        res.json(proveedores.rows);
    
    } catch (error) {
        console.error('Error al obtener proveedores:', error);
        res.status(500).json({ error: 'Error al obtener proveedores' });
    }
  
});

// Actualizar un proveedor existente
router.put('/:idproveedor', async (req, res) => {

    const id = req.params.idproveedor;
    const updates = req.body;
  
    try {

        const campos = Object.keys(updates);
        const valores = Object.values(updates);

        if (campos.length === 0) {
            return res.status(404).json({ message: 'Actualización sin cambios' });
        }

        const clausula = campos.map((campo, i) => `${campo} = $${i + 1}`).join(', ');
        valores.push(id);

        const query = `UPDATE proveedor SET ${clausula} WHERE idproveedor = $${valores.length}`;
        const result = await pool.query(query, valores);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'proveedor no encontrado' });
        }
    
        res.json(result.rows);
  
    } catch (error) {
        console.error('Error al obtener al proveedor:', error);
        res.status(500).json({ error: 'Error al obtener al proveedor' });
    }
});

module.exports = router;
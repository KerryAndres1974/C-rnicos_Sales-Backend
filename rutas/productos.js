const router = require("express").Router();
const pool = require('../database');

// Crear un nuevo producto
router.post('/', async (req, res) => {
    const productos = req.body;
  
    const fechac = new Date();
    const fechav = new Date(fechac);
    fechav.setMonth(fechav.getMonth() + 2);
  
    try {
  
        for (const producto of productos){
            const query = `INSERT INTO inventario (nombreproducto, tipoproducto, precioxlibra,
                      cantidadxlibra, idproveedor, fechacompra, fechavencimiento, preciocompra)
                      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;

            await pool.query(query, [
                producto.nombreproducto,
                producto.tipoproducto,
                producto.precioxlibra,
                producto.cantidadxlibra,
                producto.idproveedor,
                fechac.toLocaleDateString(),
                fechav.toLocaleDateString(),
                producto.preciocompra
            ]);
        };
  
        res.status(200).json({ message: 'Producto(s) añadido(s) con exito' });
  
    } catch (error) {
        console.error('Error al agregar producto(s):', error);
        res.status(500).json({ error: 'Error al agregar producto(s)' });
    }
});

// Obtener todos los productos disponibles
router.get('/', async (req, res) => {

    try {
        // Consulta SQL para obtener los productos
        const query = `SELECT i.*, p.telefono FROM inventario i 
            INNER JOIN proveedor p
            ON p.idproveedor = i.idproveedor
            WHERE activo = true AND cantidadxlibra > 0
            ORDER BY promocion DESC`;
        
        // Ejecutar la consulta
        const productos = await pool.query(query);
        
        // Enviar la respuesta con los productos encontrados
        res.json(productos.rows);

    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// Obtener productos vendidos
router.get('/vendidos', async (req, res) => {

    try {
        const query = `
            SELECT 
                producto->>'id' AS id,
                producto->>'nombre' AS nombre,
                producto->>'cantidad' AS cantidad,
                i.preciocompra,
                i.precioxlibra
            FROM (
                SELECT 
                    json_array_elements(venta.producto::json) AS producto
                FROM venta
                UNION ALL
                SELECT 
                    json_array_elements(reserva.producto::json) AS producto 
                FROM reserva WHERE estado = 'completo'
            ) AS productos_vendidos
            JOIN inventario i ON (producto->>'id')::int = i.idproducto`;

        const vendidos = await pool.query(query);

        res.json(vendidos.rows);
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
})

// Obtener un producto especifico
router.get('/:idproducto', async (req, res) => {

    const id = req.params.idproducto;
  
    try {
        const query = 'SELECT * FROM inventario WHERE idproducto = $1 AND activo = true';
        const result = await pool.query(query, [id]);
    
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
    
        res.json(result.rows);
  
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// Actualizar un producto existente
router.put('/:idproducto', async (req, res) => {

    const id = req.params.idproducto;
    const updates = req.body;
  
    try {

        const campos = Object.keys(updates);
        const valores = Object.values(updates);

        if (campos.length === 0) {
            return res.status(404).json({ message: 'Actualización sin cambios' });
        }

        const clausula = campos.map((campo, i) => `${campo} = $${i + 1}`).join(', ');
        valores.push(id);

        const query = `UPDATE inventario SET ${clausula} WHERE idproducto = $${valores.length}`;
        const result = await pool.query(query, valores);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'producto no encontrado' });
        }
    
        res.json(result.rows);
  
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

module.exports = router;
const router = require("express").Router();
const pool = require('../database');

// Crear un nuevo producto
router.post("/", async (req, res) => {

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
router.post("/", async (req, res) => {
    const { nombreproducto, tipoproducto } = req.body; // Leer los parámetros de búsqueda

    try {
        // Construir la consulta SQL con condiciones opcionales
        let query = 'SELECT * FROM inventario WHERE activo = true AND cantidadxlibra > 0';
        const conditions = [];
        const values = [];

        // Verificar si se proporciona `nombreproducto` y añadirlo a las condiciones
        if (nombreproducto) {
            conditions.push(`nombreproducto ILIKE $${conditions.length + 1}`);
            values.push(`%${nombreproducto}%`); // Añadir el valor con comodines
        }

        // Verificar si se proporciona `tipoproducto` y añadirlo a las condiciones
        if (tipoproducto) {
            conditions.push(`tipoproducto ILIKE $${conditions.length + 1}`);
            values.push(`%${tipoproducto}%`); // Añadir el valor con comodines
        }

        // Si existen condiciones, agregarlas a la consulta SQL
        if (conditions.length > 0) {
            query += ` AND ${conditions.join(' AND ')}`;
        }
        
        // Ejecutar la consulta con los valores
        const productos = await pool.query(query, values);
        
        // Enviar la respuesta con los productos encontrados
        res.json(productos.rows);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// Obtener un producto especifico
router.get('/:idproducto', async (req, res) => {

    const id = req.params.idproducto
  
    try {
        const query = `SELECT * FROM inventario WHERE idproducto = $1 AND activo = true`
        const result = await pool.query(query, [id])
    
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Producto no encontrado' });
        }
    
        res.json(result.rows)
  
    } catch (error) {
        console.error('Error al obtener el producto:', error)
        res.status(500).json({ error: 'Error al obtener el producto' })
    }
});

// Actualizar un producto existente
router.put('/:idproducto', async (req, res) => {

    const id = req.params.idproducto;
    let { nombre, tipo, preciol, cantidad, idprovee, fechac, fechav, precioc, activo } = req.body;
  
    try {

        const queryExist = 'SELECT * FROM inventario WHERE idproducto = $1';
        const existeProd = await pool.query(queryExist, [id]);

        if (existeProd.rowCount === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        if (nombre === ''){
            nombre = existeProd.rows[0].nombreproducto;
        }
        if (tipo === ''){
            tipo = existeProd.rows[0].tipoproducto;
        }
        if (preciol === ''){
            preciol = existeProd.rows[0].precioxlibra;
        }
        if (cantidad === ''){
            cantidad = existeProd.rows[0].cantidadxlibra;
        }
        if (idprovee === ''){
            idprovee = existeProd.rows[0].idproveedor;
        }
        if (fechac === ''){
            fechac = existeProd.rows[0].fechacompra;
        }
        if (fechav === ''){
            fechav = existeProd.rows[0].fechavencimiento;
        }
        if (precioc === ''){
            precioc = existeProd.rows[0].preciocompra;
        }

        const query = `UPDATE inventario 
            SET 
                nombreproducto = $1,
                tipoproducto = $2,
                precioxlibra = $3,
                cantidadxlibra = $4,
                idproveedor = $5,
                fechacompra = $6,
                fechavencimiento = $7,
                preciocompra = $8,
                activo = $9
            WHERE idproducto = $10`;

        const result = await pool.query(query, [nombre, tipo, preciol, cantidad, idprovee, fechac, fechav, precioc, activo, id]);
    
        res.json(result.rows);
  
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

module.exports = router;
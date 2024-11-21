const router = require("express").Router();
const pool = require('../database');

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
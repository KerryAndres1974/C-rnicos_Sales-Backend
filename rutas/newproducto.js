const router = require("express").Router()
const pool = require('../database')

router.post("/", async (req, res) => {

    const productos = req.body
  
    const fechac = new Date()
    const fechav = new Date(fechac)
    fechav.setMonth(fechav.getMonth() + 2)
  
    try {
  
        for (const producto of productos){
            const query = `INSERT INTO inventario (nombreproducto, tipoproducto, precioxlibra,
                      cantidadxlibra, idproveedor, fechacompra, fechavencimiento, preciocompra)
                      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`

            await pool.query(query, [
                producto.nombreproducto,
                producto.tipoproducto,
                producto.precioxlibra,
                producto.cantidadxlibra,
                producto.idproveedor,
                fechac.toLocaleDateString(),
                fechav.toLocaleDateString(),
                producto.preciocompra
            ])
        }
  
        res.status(200).json({ message: 'Producto(s) añadido(s) con exito' })
  
    } catch (error) {
        console.error('Error al agregar producto(s):', error)
        res.status(500).json({ error: 'Error al agregar producto(s)' })
    }
})

module.exports = router
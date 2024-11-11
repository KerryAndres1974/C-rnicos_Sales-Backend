const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

// Configuracion de express
const app = express()
app.use(bodyParser.json())
app.use(cors())

// Configuracion del servidor
const PORT = 8000
app.listen(PORT, () => {
    console.log(`Servidor backend activo en el puerto ${PORT}\n`)
})

// Manejo y llamado de rutas
app.use('/login', require('./rutas/login'));
app.use('/get-product', require('./rutas/producto'));
app.use('/get-products', require('./rutas/productos'));
app.use('/new-product', require('./rutas/newproducto'));
app.use('/new-provider', require('./rutas/newproveedor'));
app.use('/get-providers', require('./rutas/proveedores'));
app.use('/new-reserva', require('./rutas/reservas'));
app.use('/new-venta', require('./rutas/ventas'));
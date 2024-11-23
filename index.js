const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

// Configuracion de express
const app = express()
app.use(bodyParser.json())
app.use(cors())

// Manejo y llamado de rutas
app.use('/login', require('./rutas/login'));
app.use('/register', require('./rutas/register'));

app.use('/proveedores', require('./rutas/proveedores'));
app.use('/productos', require('./rutas/productos'));
app.use('/reservas', require('./rutas/reservas'));
app.use('/ventas', require('./rutas/ventas'));


// Exportar app para pruebas
module.exports = app;

// Configuracion del servidor
if (require.main === module) {
    const PORT = 8000
    app.listen(PORT, () => {
        console.log(`Servidor backend activo en el puerto ${PORT}\n`)
    })
}
const request = require('supertest');
const express = require('express');
const pool = require('../database');
const newProductoRouter = require('../rutas/newproducto.js');

// Mock de la base de datos
jest.mock('../database');

describe('POST /newproducto', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/newproducto', newProductoRouter); // Aquí montamos la ruta en la aplicación
  });

  it('debería agregar un producto correctamente y devolver un mensaje de éxito', async () => {
    // Mock de los datos de entrada
    const productos = [
      {
        nombreproducto: 'Producto A',
        tipoproducto: 'Tipo A',
        precioxlibra: 10,
        cantidadxlibra: 5,
        idproveedor: 1,
        preciocompra: 50,
      },
    ];

    // Mock para el pool.query que simula una inserción exitosa
    pool.query.mockResolvedValue({ rowCount: 1 });

    // Enviamos la solicitud POST
    const response = await request(app)
      .post('/newproducto')
      .send(productos)
      .set('Accept', 'application/json');

    // Verificamos la respuesta
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Producto(s) añadido(s) con exito');
    expect(pool.query).toHaveBeenCalledTimes(1); // Verifica que se haya llamado a pool.query una vez
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), expect.any(Array)); // Verifica que la consulta haya sido ejecutada
  });

  it('debería manejar un error y devolver un mensaje de error en caso de fallo', async () => {
    const productos = [
      {
        nombreproducto: 'Producto A',
        tipoproducto: 'Tipo A',
        precioxlibra: 10,
        cantidadxlibra: 5,
        idproveedor: 1,
        preciocompra: 50,
      },
    ];

    // Mock para el pool.query que simula un error
    pool.query.mockRejectedValue(new Error('Error en la base de datos'));

    // Enviamos la solicitud POST
    const response = await request(app)
      .post('/newproducto')
      .send(productos)
      .set('Accept', 'application/json');

    // Verificamos la respuesta
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Error al agregar producto(s)');
  });
});

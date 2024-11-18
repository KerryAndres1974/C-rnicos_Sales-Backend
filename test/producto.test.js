const request = require('supertest');
const express = require('express');
const pool = require('../database');
const productoRouter = require('../rutas/producto.js');

// Mockeamos la consulta a la base de datos
jest.mock('../database');

describe('GET /producto/:idproducto', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/producto', productoRouter);
  });

  it('debería devolver un producto cuando el id es válido', async () => {
    // Mock de los datos de salida
    const mockProducto = [
      {
        idproducto: 1,
        nombreproducto: 'Producto A',
        tipoproducto: 'Tipo A',
        precioxlibra: 10,
        cantidadxlibra: 5,
        idproveedor: 1,
        preciocompra: 50,
        fechacompra: '2024-11-01',
        fechavencimiento: '2024-12-01',
      }
    ];

    // Mock para el pool.query que simula una respuesta exitosa
    pool.query.mockResolvedValue({ rows: mockProducto });

    // Enviamos la solicitud GET
    const response = await request(app)
      .get('/producto/1') // Reemplaza '1' por el id del producto que estamos buscando
      .set('Accept', 'application/json');

    // Verificamos la respuesta
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockProducto);
    expect(pool.query).toHaveBeenCalledTimes(1); // Verifica que se haya llamado a pool.query una vez
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM inventario WHERE idproducto = $1', ['1']); // Verifica la consulta y los parámetros
  });

  it('debería devolver un mensaje de error 401 si el producto no se encuentra', async () => {
    // Mock para el pool.query que simula que no se encuentra el producto
    pool.query.mockResolvedValue({ rows: [] });

    // Enviamos la solicitud GET
    const response = await request(app)
      .get('/producto/999') // Reemplaza por un id que no exista
      .set('Accept', 'application/json');

    // Verificamos la respuesta
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Producto no encontrado');
  });

  it('debería manejar un error y devolver un mensaje de error 500 en caso de fallo de la base de datos', async () => {
    // Mock para el pool.query que simula un error en la base de datos
    pool.query.mockRejectedValue(new Error('Error en la base de datos'));

    // Enviamos la solicitud GET
    const response = await request(app)
      .get('/producto/1') // Reemplazamos '1' por el id del producto
      .set('Accept', 'application/json');

    // Verificamos la respuesta
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Error al obtener el producto');
  });
});

const request = require('supertest');
const pool = require('../database');
const index = require('../index');
jest.mock('../database');

describe('Productos - Tiempo de ejecucion', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test crear CHECK
    it('Deberia crear el nuevo producto dentro del tiempo esperado', async () => {
        const productos = [
            {
                nombreproducto: "Producto A",
                tipoproducto: "Tipo A",
                precioxlibra: 100,
                cantidadxlibra: 5,
                idproveedor: 1,
                preciocompra: 500
            },
            {
                nombreproducto: "Producto B",
                tipoproducto: "Tipo B",
                precioxlibra: 150,
                cantidadxlibra: 3,
                idproveedor: 2,
                preciocompra: 450
            }
        ];
        
        const inicio = Date.now();
        
        const response = await request(index).post('/productos')
            .send(productos);

        const fin = Date.now();
        const tiempo_de_ejecucion = fin -inicio;

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Producto(s) añadido(s) con exito");
        expect(tiempo_de_ejecucion).toBeLessThan(5000);

    });

    // Test obtener todos CHECK
    it('Deberia traer todos los productos dentro del tiempo esperado', async () => {
        const inicio = Date.now();

        pool.query.mockImplementationOnce((query, params) => {
            if (query.includes('SELECT')) {
                return Promise.resolve({ rowCount: 1, rows: [] });
            }
        });

        const response = await request(index).get('/productos');

        const fin = Date.now();
        const tiempo_de_ejecucion = fin - inicio;

        expect(response.status).toBe(200);
        expect(tiempo_de_ejecucion).toBeLessThan(200);

    });

    // Test obtener uno CHECK
    it('Deberia traer un producto dentro del tiempo esperado', async () => {
        const inicio = Date.now();

        pool.query.mockImplementationOnce((query, params) => {
            if (query.includes('SELECT')) {
                return Promise.resolve({ rowCount: 1, rows: [] });
            }
        });

        const response = await request(index).get('/productos/1');

        const fin = Date.now();
        const tiempo_de_ejecucion = fin - inicio;
        
        expect(response.status).toBe(200, `Error en el endpoint: ${response.body.error || 'sin detalles'}`);
        expect(tiempo_de_ejecucion).toBeLessThan(100);
    });

    // Test actualizar CHECK
    it('Deberia actualizar el producto dentro del tiempo esperado', async () => {
        const inicio = Date.now();

        pool.query.mockImplementationOnce((query, params) => {
            if (query.includes('UPDATE')) {
                return Promise.resolve({ rowCount: 1, rows: [] });
            }
        });

        const response = await request(index).put('/productos/1')
            .send({
                nombreproducto: 'producto actualizado',
                tipoproducto: 'tipo actualizado'
            });

        const fin = Date.now();
        const tiempo_de_ejecucion = fin - inicio;

        expect(response.status).toBe(200);
        expect(tiempo_de_ejecucion).toBeLessThan(500);

    });
});
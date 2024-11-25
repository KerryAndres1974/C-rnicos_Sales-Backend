const request = require('supertest');
const pool = require('../database');
const index = require('../index');
jest.mock('../database');

describe('Proveedores - Tiempo de ejecucion', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test crear CHECK
    it('Deberia crear una venta dentro del tiempo esperado', async () => {

        const venta = {
            id: 'prueba',
            nombreempleado: 'prueba',
            totalventa: '120',
            fecha: 'prueba',
            producto: [
                { nombre: "Producto A", cantidad: 2 },
                { nombre: "Producto B", cantidad: 3 }
            ],
        }

        const inicio = Date.now();

        pool.query.mockImplementation(() => {
            return Promise.resolve({ rows: [{ id: 123 }] });
        });

        const response = await request(index).post('/ventas')
            .send(venta);

        const fin = Date.now();
        const tiempo_de_ejecucion = fin - inicio;

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Venta añadida con exito");
        expect(tiempo_de_ejecucion).toBeLessThan(200);

    });
})
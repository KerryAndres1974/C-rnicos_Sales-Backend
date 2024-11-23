const request = require('supertest');
const pool = require('../database');
const index = require('../index');
jest.mock('../database');

describe('Proveedores - Tiempo de ejecucion', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test crear CHECK
    it('Deberia crear un proveedor dentro del tiempo esperado', async () => {
        
        const proveedor = {
            nit: 1,
            nombre: 'prueba',
            telefono: 'prueba',
            direccion: 'prueba',
            tipo: 'prueba'
        }

        const inicio = Date.now();

        pool.query.mockImplementation(() => {
            return Promise.resolve({ rows: [{ id: 123 }] });
        });

        const response = await request(index).post('/proveedores')
            .send(proveedor);

        const fin = Date.now();
        const tiempo_de_ejecucion = fin - inicio;

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Proveedor añadido con exito");
        expect(tiempo_de_ejecucion).toBeLessThan(100);

    });

    // Test obtener CHECK
    it('Deberia obtener todos los proveedores dentro del tiempo esperado', async () => {
        const inicio = Date.now();

        pool.query.mockImplementation(() => {
            return Promise.resolve({ rows: [] });
        });

        const response = await request(index).get('/proveedores');

        const fin = Date.now();
        const tiempo_de_ejecucion = fin - inicio;

        expect(response.status).toBe(200);
        expect(tiempo_de_ejecucion).toBeLessThan(200);

    });

    //Test actualizar CHECK
    it('Deberia actualizar un proveedor dentro del tiempo esperado', async () => {
        const inicio = Date.now();

        pool.query.mockImplementation(() => {
            return Promise.resolve({ rows: [] });
        });

        const response = await request(index).put('/proveedores/1')
            .send({
                nombre: 'prueba'
            });

        const fin = Date.now();
        const tiempo_de_ejecucion = fin - inicio;

        expect(response.status).toBe(200);
        expect(tiempo_de_ejecucion).toBeLessThan(100);
    });
})
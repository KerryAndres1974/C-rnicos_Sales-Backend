const request = require('supertest');
const pool = require('../database');
const index = require('../index');
jest.mock('../database');

describe('Reservas - Tiempo de ejecucion', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test crear CHECK
    it('Deberia crear una reserva dentro del tiempo esperado', async () => {
        
        const reserva = {
            reserva: {
                id: 1,
                fecha: "2024-12-01",
                producto: [
                    { nombre: "Producto A", cantidad: 2 },
                    { nombre: "Producto B", cantidad: 3 }
                ],
                valor: 100000
            },
            cliente: {
                cor: "cliente@example.com",
                nom: "Juan Pérez",
                dir: "Calle Falsa 123",
                tel: "123456789"
            }
        };

        const inicio = Date.now();

        pool.query.mockImplementation(() => {
            return Promise.resolve({ rows: [{ id: 123 }] });
        });

        const response = await request(index).post('/reservas')
            .send(reserva);

        const fin = Date.now();
        const tiempo_de_ejecucion = fin - inicio;

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Reserva añadida con exito");
        expect(tiempo_de_ejecucion).toBeLessThan(5000);

    });

    // Test obtener CHECK
    it('Deberia traer todas las reservas pendientes dentro del tiempo esperado', async () => {
        const inicio = Date.now();

        pool.query.mockImplementation(() => {
            return Promise.resolve({ rows: [] });
        });

        const response = await request(index).get('/reservas');

        const fin = Date.now();
        const tiempo_de_ejecucion = fin - inicio;

        expect(response.status).toBe(200);
        expect(tiempo_de_ejecucion).toBeLessThan(200);

    });

    // Test actualizar CHECK
    it('Deberia actualizar el estado de una reserva dentro del tiempo esperado', async () => {
        const inicio = Date.now();

        pool.query.mockImplementation(() => {
            return Promise.resolve({ rows: [] });
        });

        const response = await request(index).put('/reservas/1')
            .send({
                estado: 'completo'
            });

        const fin = Date.now();
        const tiempo_de_ejecucion = fin - inicio;

        expect(response.status).toBe(200);
        expect(tiempo_de_ejecucion).toBeLessThan(100);

    });
});
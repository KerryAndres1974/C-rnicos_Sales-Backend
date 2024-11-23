const request = require('supertest');
const pool = require('../database');
const index = require('../index');
jest.mock('../database');

describe('PUT /:idproducto - Tiempo de ejecucion', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Deberia actualizar el producto dentro del tiempo esperado', async () => {

        pool.query.mockImplementationOnce((query, params) => {
            if (query.includes('SELECT')) {
                return Promise.resolve({
                    rowCount: 1,
                    rows: [
                        {
                            nombreproducto: 'producto1',
                            tipoproducto: 'tipo1',
                            precioxlibra: 10,
                            cantidadxlibra: 10,
                            idproveedor: 1,
                            fechacompra: '2024-11-11',
                            fechavencimiento: '2024-11-11',
                            preciocompra: 100,
                        },
                    ],
                });
            }
        });

        pool.query.mockImplementationOnce((query, params) => {
            if (query.includes('UPDATE')) {
                return Promise.resolve({ rowCount: 1, rows: [] });
            }
        });

        const inicio = Date.now();

        const response = await request(index)
            .put('/edit-product/1')
            .send({
                nombreproducto: 'producto actualizado',
                tipoproducto: 'tipo actualizado',
                preciol: '',
                cantidad: '',
                idprovee: '',
                fechac: '',
                fechav: '',
                precioc: '',
                activo: true,
            });

        const fin = Date.now();
        const tiempo_de_ejecucion = fin - inicio;

        expect(response.status).toBe(200);
        expect(tiempo_de_ejecucion).toBeLessThan(500);
    })
});
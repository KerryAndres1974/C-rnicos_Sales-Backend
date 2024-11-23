const request = require('supertest');
const pool = require('../database');
const index = require('../index');
jest.mock('../database');

describe('PUT /:idreserva - Tiempo de ejecucion', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Deberia actualizar el producto dentro del tiempo esperado', async () => {

    });
});
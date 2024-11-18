const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const sinon = require('sinon');
const pool = require('../database');
const router = require('../rutas/register.js');

// Creamos una instancia de la aplicación Express
const app = express();
app.use(express.json());
app.use('/register', router);

// Mockear el método pool.query
jest.mock('../database', () => ({
  query: jest.fn(),
}));

describe('POST /register', () => {
  let bcryptHashStub;

  beforeEach(() => {
    // Restablecemos el mock entre pruebas
    pool.query.mockReset();
    bcryptHashStub = sinon.stub(bcrypt, 'hash');
  });

  afterEach(() => {
    // Restauramos el stub de bcrypt
    bcryptHashStub.restore();
  });

  it('should return 400 if email is already in use', async () => {
    // Simulamos que el correo ya existe en la base de datos
    pool.query.mockResolvedValueOnce({
      rows: [{ correo: 'test@example.com' }]
    });

    const response = await request(app)
      .post('/register')
      .send({
        nombre: 'Test User',
        correo: 'test@example.com',
        pass: '123456',
        tel: '1234567890'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('El correo electrónico ya está en uso');
  });

  it('should hash password and insert new user into the database', async () => {
    // Simulamos que el correo no existe en la base de datos
    pool.query.mockResolvedValueOnce({ rows: [] });

    // Simulamos que bcrypt.hash devuelve una contraseña hasheada
    bcryptHashStub.resolves('hashed_password');

    // Simulamos la inserción de un nuevo usuario en la base de datos
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, nombre: 'Test User', correo: 'test@example.com', telefono: '1234567890' }]
    });

    const response = await request(app)
      .post('/register')
      .send({
        nombre: 'Test User',
        correo: 'test@example.com',
        pass: '123456',
        tel: '1234567890'
      });

    expect(response.status).toBe(201);
    expect(response.body.nombre).toBe('Test User');
    expect(response.body.correo).toBe('test@example.com');
    expect(response.body.telefono).toBe('1234567890');
  });

  it('should return 500 if there is an error inserting into the database', async () => {
    // Simulamos que el correo no existe en la base de datos
    pool.query.mockResolvedValueOnce({ rows: [] });

    // Simulamos un error al insertar en la base de datos
    pool.query.mockRejectedValueOnce(new Error('Database insert error'));

    const response = await request(app)
      .post('/register')
      .send({
        nombre: 'Test User',
        correo: 'test@example.com',
        pass: '123456',
        tel: '1234567890'
      });

    expect(response.status).toBe(500);
    expect(response.body.err).toBe('Error al agregar al empleado');
  });
});

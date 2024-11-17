const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Crear una aplicación Express para las pruebas
const app = express();

// Importar la ruta del login
const loginRoute = require('../rutas/login.js');  // Asegúrate de que el path sea el correcto

app.use(express.json());
app.use('/login', loginRoute);

// Mock de la base de datos
jest.mock('../database', () => ({
  query: jest.fn()
}));

// Mock de JWT
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

// Mock de bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn()
}));

describe('POST /login', () => {
  
  it('should return 401 if user is not found', async () => {
    // Simulamos una base de datos vacía
    const pool = require('../database');
    pool.query.mockResolvedValue({ rows: [] });

    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Usuario no encontrado');
  });

  it('should return 401 if password is incorrect', async () => {
    const pool = require('../database');
    const bcrypt = require('bcrypt');

    // Simulamos un usuario con contraseña incorrecta
    pool.query.mockResolvedValue({
      rows: [
        {
          email: 'test@example.com',
          contraseña: 'hashedPassword123'
        }
      ]
    });

    // Simulamos que bcrypt compare devuelve false (contraseña incorrecta)
    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Contraseña incorrecta');
  });

  it('should return a token if login is successful', async () => {
    const pool = require('../database');
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');

    // Simulamos un usuario con contraseña correcta
    pool.query.mockResolvedValue({
      rows: [
        {
          email: 'test@example.com',
          contraseña: 'hashedPassword123'
        }
      ]
    });

    // Simulamos que bcrypt compare devuelve true (contraseña correcta)
    bcrypt.compare.mockResolvedValue(true);

    // Simulamos la creación de un token JWT
    jwt.sign.mockReturnValue('fake-jwt-token');

    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Inicio de sesión exitoso');
    expect(response.body.token).toBe('fake-jwt-token');
  });

  it('should return 500 if there is an internal server error', async () => {
    const pool = require('../database');

    // Simulamos un error en la base de datos
    pool.query.mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Error al iniciar sesión');
  });

});


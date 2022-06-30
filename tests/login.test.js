const supertest = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = require('../app');

const api = supertest(app);

const User = require('../models/user');

describe('authenticatiing', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('admin1', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('succeeds when a valid username and password is provided', async () => {
    const login = {
      username: 'root',
      password: 'admin1',
    };

    const response = await api
      .post('/api/login')
      .send(login)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.token).toBeDefined();
  });

  test('fails when an invalid username is provided', async () => {
    const login = {
      username: 'root-beer',
      password: 'admin1',
    };

    const response = await api
      .post('/api/login')
      .send(login)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toContain('Invalid username or password');
  });

  test('fails when an invalid password is provided', async () => {
    const login = {
      username: 'root',
      password: 'admin12',
    };

    const response = await api
      .post('/api/login')
      .send(login)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toContain('Invalid username or password');
  });

  test('fails when both an invalid username and an invalid password is provided', async () => {
    const login = {
      username: 'root-beer',
      password: 'admin12',
    };

    const response = await api
      .post('/api/login')
      .send(login)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toContain('Invalid username or password');
  });
});

afterAll(() => {
  mongoose.connection.close();
});

const supertest = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = require('../app');

const api = supertest(app);

const User = require('../models/user');

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('admin1', 10);
  const user = new User({ username: 'root', passwordHash });

  await user.save();
});

describe('when there is initially one user', () => {
  test('creating a new user succeeds with a unique username', async () => {
    const newUser = {
      username: 'llama',
      name: 'King Cuzco',
      password: 'spinach-puffs',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  });

  test('creating a new user fails if the username is not unique', async () => {
    const newUser = {
      username: 'root',
      name: 'Someone Important',
      password: 'admin2',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('Username must be unique');
  });

  test('creating a new user fails with if a username is not provided', async () => {
    const newUser = {
      name: 'Super root beer user',
      password: 'root-beer',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('Username must be provided');
  });

  test('creating a new user fails if a password not provided', async () => {
    const newUser = {
      username: 'rootbeer',
      name: 'Super root beer user',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('Password must be provided');
  });
});

afterAll(() => {
  mongoose.connection.close();
});

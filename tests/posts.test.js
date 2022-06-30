const supertest = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const helper = require('./test_helper');
const app = require('../app');
const Post = require('../models/post');
const User = require('../models/user');

const api = supertest(app);

describe('authenticated users', () => {
  beforeEach(async () => {
    await Post.deleteMany({});
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('admin1', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();

    const posts = helper.initialPosts.map((post) => new Post(post));
    const promises = posts.map((post) => post.save());
    await Promise.all(promises);
  });

  test('can create a valid post', async () => {
    const post = {
      title: 'a valid post',
      content: 'just some content',
    };

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'admin1' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const { token } = loginResponse.body;

    await api
      .post('/api/posts')
      .set('Authorization', `bearer ${token}`)
      .send(post)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const allPosts = await helper.getAllPosts();
    expect(allPosts).toHaveLength(helper.initialPosts.length + 1);
  });

  test('cannot create a post without a title', async () => {
    const post = {
      content: 'just some content',
    };

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'admin1' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const { token } = loginResponse.body;

    await api
      .post('/api/posts')
      .set('Authorization', `bearer ${token}`)
      .send(post)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const allPosts = await helper.getAllPosts();
    expect(allPosts).toHaveLength(helper.initialPosts.length);
  });

  test('cannot create a post without any content', async () => {
    const post = {
      title: 'Just a title',
    };

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'admin1' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const { token } = loginResponse.body;

    await api
      .post('/api/posts')
      .set('Authorization', `bearer ${token}`)
      .send(post)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const allPosts = await helper.getAllPosts();
    expect(allPosts).toHaveLength(helper.initialPosts.length);
  });

  test('cannot create a post without a title and without any content', async () => {
    const post = {};

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'admin1' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const { token } = loginResponse.body;

    await api
      .post('/api/posts')
      .set('Authorization', `bearer ${token}`)
      .send(post)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const allPosts = await helper.getAllPosts();
    expect(allPosts).toHaveLength(helper.initialPosts.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});

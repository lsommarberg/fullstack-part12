const bcrypt = require('bcrypt');
const User = require('../models/user');
const helper = require('../utils/list_helper');
const jwt = require('jsonwebtoken');

const Blog = require('../models/blog');
const { test, after, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes('expected `username` to be unique'));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('get works for one user', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('creation fails with proper statuscode and message if password does not exist', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes('Username and password are required'));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('creation fails with proper statuscode and message if username does not exist', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: 'Superuser',
      password: '12345',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes('Username and password are required'));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
  test.only('creation fails with proper statuscode and message if username is too short', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: 'Superuser',
      username: 'su',
      password: '12345',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(
      result.body.error.includes(
        'Username and password must be at least 3 characters long',
      ),
    );

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
  test('creation fails with proper statuscode and message if password is too short', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: 'Superuser',
      username: 'root',
      password: '12',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(
      result.body.error.includes(
        'Username and password must be at least 3 characters long',
      ),
    );

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
];

describe.only('Routes for blogs', () => {
  let token;
  let userId;

  beforeEach(async () => {
    require('dotenv').config();

    await Blog.deleteMany({});
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'username', passwordHash });
    const savedUser = await user.save();
    userId = savedUser._id;

    const userForToken = {
      username: savedUser.username,
      id: savedUser._id,
    };

    token = jwt.sign(userForToken, process.env.SECRET);

    if (!token) {
      throw new Error('Token not created');
    }

    for (let blog of initialBlogs) {
      let blogObject = new Blog(blog);
      blogObject.user = userId;
      await blogObject.save();
    }
  });

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('there are two blogs', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(response.body.length, initialBlogs.length);
  });

  test('the blog id is json', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`);

    const ids = response.body.map((e) => e.id);
    assert(ids.includes('5a422a851b54a676234d17f7'));
  });

  test('the blog gets added with post', async () => {
    const newBlog = {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0,
      user: userId,
    };
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`);

    const titles = response.body.map((r) => r.title);

    assert.strictEqual(response.body.length, initialBlogs.length + 1);

    assert(titles.includes('Canonical string reduction'));
  });

  test('the blog gets 0 likes as default', async () => {
    const newBlog = {
      _id: '5a422ba71b54a676234d17fb',
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      __v: 0,
      user: userId,
    };
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`);

    const likes = response.body.map((r) => r.likes);

    assert.strictEqual(response.body.length, initialBlogs.length + 1);

    assert(likes.includes(0));
  });

  test('the error is handled if there is no title', async () => {
    const newBlog = {
      _id: '5a422ba71b54a676234d17fb',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0,
      __v: 0,
      user: userId,
    };
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400);
  });

  test('the error is handled if there is no url', async () => {
    const newBlog = {
      _id: '5a422ba71b54a676234d17fb',
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      likes: 0,
      __v: 0,
      user: userId,
    };
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400);
  });

  test('delete blog works', async () => {
    await api
      .delete('/api/blogs/5a422a851b54a676234d17f7')
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const getResponse = await api
      .get('/api/blogs/5a422a851b54a676234d17f7')
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(getResponse.status, 404);
  });

  test('the blog can be modified with put', async () => {
    const modifiedBlog = {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 6,
      __v: 0,
      user: userId,
    };
    await api
      .put('/api/blogs/5a422aa71b54a676234d17f8')
      .set('Authorization', `Bearer ${token}`)

      .send(modifiedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`);

    const likes = response.body.map((r) => r.likes);

    assert(likes.includes(6));
  });

  test.only('the blog can not be added without authorization', async () => {
    const newBlog = {
      _id: '5a422ba71b54a676234d17fb',
      title: 'Go To Statement Considered Harmful',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0,
      __v: 0,
      user: userId,
    };
    const response = await api.post('/api/blogs').send(newBlog).expect(401);
    assert.strictEqual(response.body.error, 'token missing');
  });
});
after(async () => {
  await mongoose.connection.close();
});

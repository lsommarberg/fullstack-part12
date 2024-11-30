db.createUser({
  user: 'the_username',
  pwd: 'the_password',
  roles: [
    {
      role: 'dbOwner',
      db: 'the_database',
    },
  ],
});

db.createCollection('blogs');
db.createCollection('users');

db.users.insertMany([
  {
    username: 'user1',
    name: 'User One',
    passwordHash:
      '$2b$10$Cn2xSv2jfgDOzfeeZyzyauv2AXdX9vQPNuk.EXFKBZaj/1E8MvEwq',
    blogs: [],
  },
  {
    username: 'user2',
    name: 'User Two',
    passwordHash:
      '$2b$10$6p7GwiMNNGqL5YjV5kz9Ee3WlV8WB1n5OQbeVh5U30DabpjgataPW',
    blogs: [],
  },
]);

db.blogs.insert({
  title: 'My First Blog',
  author: 'John Doe',
  url: 'http://example.com/my-first-blog',
  likes: 10,
  user: db.users.findOne({ username: 'user1' })._id,
});

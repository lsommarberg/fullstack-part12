const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs');
  response.json(users);
});

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body;
  if (!username || !password) {
    const error = new Error('Username and password are required');
    error.name = 'ValidationError';
    return next(error);
  }
  if (username.length < 3 || password.length < 3) {
    const error = new Error(
      'Username and password must be at least 3 characters long',
    );
    error.name = 'ValidationError';
    return next(error);
  }
  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();

    response.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;

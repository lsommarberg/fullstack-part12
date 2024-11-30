const config = require('./utils/config');

const express = require('express');
const app = express();
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

const mongoose = require('mongoose');

app.use(cors());
app.use(express.json());

const middleware = require('./utils/middleware');

const logger = require('./utils/logger');

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message);
  });

app.use(middleware.tokenExtractor);

app.use(middleware.requestLogger);

app.use('/login', loginRouter);
app.use('/blogs', blogsRouter);

app.use('/users', usersRouter);

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing');
  app.use('/api/testing', testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;

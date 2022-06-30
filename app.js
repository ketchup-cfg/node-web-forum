const express = require('express');
const mongoose = require('mongoose');

const app = express();
const cors = require('cors');
require('express-async-errors');
const config = require('./utils/config');
const postsRouter = require('./controllers/posts');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const middleware = require('./utils/middleware');

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);

app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;

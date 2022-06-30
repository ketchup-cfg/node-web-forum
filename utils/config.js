require('dotenv').config();

const getDatabaseUri = (env) => {
  if (env === 'development') {
    return process.env.DEV_MONGODB_URI;
  }

  if (env === 'test') {
    return process.env.TEST_MONGODB_URI;
  }

  if (env === 'production') {
    return process.env.MONGODB_URI;
  }

  return process.env.DEV_MONGODB_URI;
};

const { PORT } = process.env;
const MONGODB_URI = getDatabaseUri(process.env.NODE_ENV);

module.exports = {
  PORT,
  MONGODB_URI,
};

require('dotenv').config();

const getDatabaseUri = (env) => {
  if (env === 'dev') {
    return env.DEV_MONGODB_URI;
  }

  if (env === 'test') {
    return env.TEST_MONGODB_URI;
  }

  if (env === 'production') {
    return env.MONGODB_URI;
  }

  return env.DEV_MONGODB_URI;
};

const { PORT } = process.env;
const MONGODB_URI = getDatabaseUri(process.env.NODE_ENV);

module.exports = {
  PORT,
  MONGODB_URI,
};

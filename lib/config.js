const appPortRaw = process.env.PORT;
const appPortParsed = Number(appPortRaw);

// eslint-disable-next-line eqeqeq
const appPort = (appPortRaw == appPortParsed) ? appPortParsed : 4000;
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
const mongoDbName = process.env.MONGO_DBNAME || 'octopus';
const bypassAuth = process.env.BYPASS_AUTH === 'true';

const config = {
  appPort,
  mongoUrl,
  mongoDbName,
  bypassAuth,
};

module.exports = config;

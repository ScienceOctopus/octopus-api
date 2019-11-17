const appPortRaw = process.env.PORT;
const appPortParsed = Number(appPortRaw);
const maxFileRaw = process.env.MAX_FILESIZE_MB;
const maxFileParsed = Number(maxFileRaw);

// eslint-disable-next-line eqeqeq
const appPort = (appPortRaw === appPortParsed) ? appPortParsed : 4000;
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
const mongoDbName = process.env.MONGO_DBNAME || 'octopus';
const bypassAuth = process.env.BYPASS_AUTH === 'true';
const maxFileSizeMB = (maxFileRaw === maxFileParsed) ? maxFileParsed : 100;

const config = {
  appPort,
  mongoUrl,
  mongoDbName,
  bypassAuth,
  maxFileSizeMB,
};

module.exports = config;

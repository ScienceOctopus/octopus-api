module.exports = {
  port: process.env.PORT || 4000,
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017',
  mongoDbName: process.env.MONGO_DBNAME || 'octopus',
};

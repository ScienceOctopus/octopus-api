const ReversionsModel = require('../../lib/mongo').reversions;

function createReversion(data, callback) {
  return ReversionsModel.insertOne(data, callback);
}

function getReversion(publicationID, _revision, callback) {
  const revision = parseInt(_revision, 10);
  return ReversionsModel.find({ publicationID, revision }, callback);
}

module.exports = {
  createReversion,
  getReversion,
};

const ArchiveModel = require('../../lib/mongo').archive;

function createArchive(data, callback) {
  return ArchiveModel.insertOne(data, callback);
}

function getArchive(publicationID, _revision, callback) {
  const revision = parseInt(_revision, 10);
  return ArchiveModel.find({ publicationID, revision }, callback);
}

module.exports = {
  createArchive,
  getArchive,
};

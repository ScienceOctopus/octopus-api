const PublicationsModel = require('../mongo').publications;

function getPublicationByID(id, callback) {
  return PublicationsModel.getByID(id, callback);
}

function findPublications(query, callback) {
  return PublicationsModel.find(query, callback);
}

module.exports = {
  getPublicationByID,
  findPublications,
};

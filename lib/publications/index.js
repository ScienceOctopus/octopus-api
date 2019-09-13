const PublicationsModel = require('../mongo').publications;

function getPublicationByID(id, callback) {
  return PublicationsModel.getById(id, callback);
}

module.exports = {
  getPublicationByID,
};

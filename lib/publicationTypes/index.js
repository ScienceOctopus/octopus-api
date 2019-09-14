const PublicationTypesModel = require('../mongo').publicationTypes;

function getAllTypes(callback) {
  return PublicationTypesModel.find({}, callback);
}

function getTypeByID(id, callback) {
  return PublicationTypesModel.getByID(id, callback);
}

module.exports = {
  getAllTypes,
  getTypeByID,
};

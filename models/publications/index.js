const PublicationsModel = require('../../lib/mongo').publications;

function createPublication(data, callback) {
  return PublicationsModel.insertOne(data, callback);
}

function updatePublication(data, callback) {
  return PublicationsModel.updateOne({ _id: data._id }, data, callback);
}

function getPublicationByID(id, callback) {
  return PublicationsModel.getByID(id, callback);
}

function findPublications(query, callback) {
  let mongoQuery = { $and: [] };

  if (typeof query.phrase === 'string' && query.phrase.trim().length) {
    const phraseRegExp = new RegExp(query.phrase.trim(), 'ig');
    const phraseQuery = {
      $or: [
        { title: { $regex: phraseRegExp } },
      ],
    };
    mongoQuery.$and.push(phraseQuery);
  }

  if (query.parentProblem) {
    const parentProblemQuery = { parentProblem: query.parentProblem };
    mongoQuery.$and.push(parentProblemQuery);
  }

  if (query.type) {
    const typeQuery = { type: String(query.type).toUpperCase() };
    mongoQuery.$and.push(typeQuery);
  }

  if (query.status) {
    const typeQuery = { status: String(query.status).toUpperCase() };
    mongoQuery.$and.push(typeQuery);
  }

  if (query.createdByUser) {
    const typeQuery = { createdByUser: query.createdByUser };
    mongoQuery.$and.push(typeQuery);
  }

  if (!mongoQuery.$and.length) {
    mongoQuery = {};
  }

  return PublicationsModel.find(mongoQuery, callback);
}

module.exports = {
  createPublication,
  updatePublication,
  getPublicationByID,
  findPublications,
};

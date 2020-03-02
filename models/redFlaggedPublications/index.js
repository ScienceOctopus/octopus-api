const RedFlaggedPublications = require('../../lib/mongo').redFlaggedPublications;

function createRedFlagPublication(data, callback) {
  return RedFlaggedPublications.insertOne(data, callback);
}

function updateResolution(data, callback) {
  return RedFlaggedPublications.updateOne({ _id: data._id }, data, callback);
}

function getResolutionByID(id, callback) {
  return RedFlaggedPublications.getByID(id, callback);
}

function findResolutions(query, callback) {
  let mongoQuery = { $and: [] };

  if (query.publicationID) {
    const publicationIDQuery = { publicationID: query.publicationID };
    mongoQuery.$and.push(publicationIDQuery);
  }

  if (!mongoQuery.$and.length) {
    mongoQuery = {};
  }

  return RedFlaggedPublications.find(mongoQuery, callback);
}

module.exports = {
  createRedFlagPublication,
  updateResolution,
  getResolutionByID,
  findResolutions,
};

const RelatedPublicationsModel = require('../../lib/mongo').relatedPublications;

function createRelatedPublication(data, callback) {
  return RelatedPublicationsModel.insertOne(data, callback);
}

function updateRelatedPublication(data, callback) {
  return RelatedPublicationsModel.updateOne({ _id: data._id }, data, callback);
}

function findRelatedPublications(query, callback) {
  let mongoQuery = { $and: [] };

  if (query.publicationID) {
    const publicationIDQuery = { publicationID: query.publicationID };
    mongoQuery.$and.push(publicationIDQuery);
  }

  if (query.relatedTo) {
    const relatedToQuery = { relatedTo: query.relatedTo };
    mongoQuery.$and.push(relatedToQuery);
  }

  if (!mongoQuery.$and.length) {
    mongoQuery = {};
  }

  return RelatedPublicationsModel.find(mongoQuery, callback);
}

module.exports = {
  createRelatedPublication,
  updateRelatedPublication,
  findRelatedPublications,
};

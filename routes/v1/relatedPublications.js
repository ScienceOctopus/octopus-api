const debug = require('debug');
const _ = require('lodash');

const RelatedPublicationsModel = require('../../models/relatedPublications');
const ObjectID = require('../../lib/mongo').ObjectID;

/**
 * @api {post} /v1/relatedPublications/createRelatedPublication Create a Related Publication
 * @apiName createRelatedPublication
 * @apiGroup RelatedPublications
 * @apiVersion 1.0.0
 * @apiSampleRequest /v1/relatedPublications/createRelatedPublication
 *
 * @apiParam {Object} data RelatedPublication's data.
 *
 * @apiUse RelatedPublicationObject
 */

function createRelatedPublication(req, res) {
  const relatedPublicationData = _.merge({}, req.body);

  return RelatedPublicationsModel.createRelatedPublication(
    relatedPublicationData,
    (relatedPublicationErr, relatedPublicationResult) => {
      if (relatedPublicationErr) {
        debug('octopus:api:error')(`Error in createRelatedPublication: ${relatedPublicationErr}`);
        debug('octopus:api:error')(`Error in createRelatedPublication data: ${relatedPublicationData}`);
        return res.send('ERROR');
      }

      return res.json(relatedPublicationResult);
    },
  );
}

/**
 * @api {post} /v1/relatedPublications/updateRelatedPublication Update a Related Publication
 * @apiName updateRelatedPublication
 * @apiGroup RelatedPublications
 * @apiVersion 1.0.0
 * @apiSampleRequest /v1/relatedPublications/updateRelatedPublication
 *
 * @apiParam {Object} data RelatedPublication's data.
 *
 * @apiUse RelatedPublicationObject
 */

function updateRelatedPublication(req, res) {
  const relatedPublicationData = _.merge({}, req.body);
  relatedPublicationData._id = ObjectID(relatedPublicationData._id);

  return RelatedPublicationsModel.updateRelatedPublication(
    relatedPublicationData,
    (relatedPublicationErr, relatedPublicationResult) => {
      if (relatedPublicationErr) {
        debug('octopus:api:error')(`Error in updateRelatedPublication: ${relatedPublicationErr}`);
        debug('octopus:api:error')(`Error in updateRelatedPublication data: ${relatedPublicationData}`);
        return res.send('ERROR');
      }

      return res.json(relatedPublicationResult);
    },
  );
}

/**
 * @api {get} /v1/relatedPublications/find Find RelatedPublications based on specified criteria
 * @apiName findRelatedPublications
 * @apiGroup RelatedPublications
 * @apiVersion 1.0.0
 * @apiSampleRequest /v1/relatedPublications/find
 *
 * @apiParam {Number} id RelatedPublication's unique ID.
 * @apiParam {Number} publicationID of RelatedPublication's publicationID.
 * @apiParam {Number} relatedTo of RelatedPublication's relatedTo.
 *
 * @apiSuccess {Array} results Array containing Related Publications matching the specified criteria
 */

function findRelatedPublications(req, res) {
  const publicationID = String(req.params.id);

  const query = {
    publicationID: req.query.publicationID,
    relatedTo: req.query.relatedTo,
  };

  return RelatedPublicationsModel.findRelatedPublications(
    query,
    (relatedPublicationErr, relatedPublicationData) => {
      if (relatedPublicationErr) {
        debug('octopus:api:error')(`Error in findRelatedPublications for ${publicationID}: ${relatedPublicationErr}`);
        return res.send('ERROR');
      }

      return res.json(relatedPublicationData);
    },
  );
}

module.exports = {
  createRelatedPublication,
  updateRelatedPublication,
  findRelatedPublications,
};

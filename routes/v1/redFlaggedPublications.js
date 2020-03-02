const debug = require('debug');
const _ = require('lodash');

const RedFlaggedPublications = require('../../models/redFlaggedPublications');
const ObjectID = require('../../lib/mongo').ObjectID;

/**
 * @api {post} /v1/redFlagPublication/add red flag a Publication
 * @apiName redFlagPublication
 * @apiGroup RedFlaggedPublications
 * @apiVersion 1.0.0
 * @apiSampleRequest /v1/publications/redFlagPublication
 *
 * @apiParam {Object} data RedFlaggedPublication's data.
 *
 * @apiUse RedFlaggedPublicationObject
 */

function addRedFlaggedPublication(req, res) {
  const redFlagPublicationData = _.merge({}, req.body);

  return RedFlaggedPublications.createRedFlagPublication(
    redFlagPublicationData,
    (redFlagPublicationErr, redFlagPublicationResult) => {
      if (redFlagPublicationErr) {
        debug('octopus:api:error')(`Error in createRedFlagPublication: ${redFlagPublicationErr}`);
        debug('octopus:api:error')(`Error in createRedFlagPublication data: ${redFlagPublicationData}`);
        return res.send('ERROR');
      }

      return res.json(redFlagPublicationResult);
    },
  );
}

/**
 * @api {post} /v1/redFlagPublication/update Update a Resolution
 * @apiName updateResolution
 * @apiGroup Publications
 * @apiVersion 1.0.0
 * @apiSampleRequest /v1/redFlagPublication/upadte
 *
 * @apiParam {Object} data Resolution's data.
 *
 * @apiUse ResolutionObject
 */

function updateResolution(req, res) {
  const resolutionData = _.merge({}, req.body);
  resolutionData._id = ObjectID(resolutionData._id);

  return RedFlaggedPublications.updateResolution(
    resolutionData,
    (resolutionErr, resolutionResult) => {
      if (resolutionErr) {
        debug('octopus:api:error')(`Error in updateResolution: ${resolutionErr}`);
        debug('octopus:api:error')(`Error in updateResolution data: ${resolutionData}`);
        return res.send('ERROR');
      }

      return res.json(resolutionResult);
    },
  );
}

/**
 * @api {get} /v1/redFlagPublication/getByID/:id Get Resolution by ID
 * @apiName getResolutionByID
 * @apiGroup Resolutions
 * @apiVersion 1.0.0
 * @apiSampleRequest /v1/redFlagPublication/getByID/:id
 *
 * @apiParam {Number} id Resolution's unique ID.
 *
 * @apiUse ResolutionObject
 */

function getResolutionByID(req, res) {
  const resolutionID = String(req.params.id);

  return RedFlaggedPublications.getResolutionByID(
    resolutionID,
    (resolutionErr, resolutionData) => {
      if (resolutionErr) {
        debug('octopus:api:error')(`Error in getResolutionByID for ${resolutionID}: ${resolutionErr}`);
        return res.send('ERROR');
      }

      return res.json(resolutionData);
    },
  );
}

/**
 * @api {get} /v1/redFlagPublication/find Find Resolution based on specified criteria
 * @apiName findResolutions
 * @apiGroup Resolutions
 * @apiVersion 1.0.0
 * @apiSampleRequest /v1/redFlagPublication/find
 *
 * @apiParam {Integer} publicationID ID of the publication it is related to
 *
 * @apiSuccess {Array} results Array containing Resolutions matching the specified criteria
 */

function findResolutions(req, res) {
  const query = {
    publicationID: req.query.publicationID,
  };

  return RedFlaggedPublications.findResolutions(
    query,
    (resolutionsErr, resolutionsData) => {
      if (resolutionsErr) {
        debug('octopus:api:error')(`Error in findResolutions for ${query.publicationID}: ${resolutionsErr}`);
        return res.send('ERROR');
      }

      return res.json(resolutionsData);
    },
  );
}

module.exports = {
  addRedFlaggedPublication,
  updateResolution,
  getResolutionByID,
  findResolutions,
};

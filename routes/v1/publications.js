const PublicationsModel = require('../../models/publications');

/**
 * @api {get} /v1/publications/getByID/:id Get Publication by ID
 * @apiName getPublicationByID
 * @apiGroup Publications
 * @apiVersion 1.0.0
 * @apiSampleRequest /v1/publications/getByID/:id
 *
 * @apiParam {Number} id Publication's unique ID.
 *
 * @apiUse PublicationObject
 */
function getPublicationByID(req, res) {
  const publicationID = Number(req.params.id);

  return PublicationsModel.getPublicationByID(publicationID, (publicationErr, publicationData) => {
    if (publicationErr) {
      return res.send('ERROR');
    }

    return res.send(publicationData);
  });
}

/**
 * @api {get} /v1/publications/find Find Publication based on specified criteria
 * @apiName findPublications
 * @apiGroup Publications
 * @apiVersion 1.0.0
 * @apiSampleRequest /v1/publications/find
 *
 * @apiParam {Integer} problemID ID of Problem to which the publication must be linked to
 * @apiParam {Integer} stageID ID of Stage at which the publication has been linked
 * @apiParam {Integer} createdByUser ID of User who created the publication
 *
 * @apiSuccess {Array} results Array containing Publications matching the specified criteria
 */
function findPublications(req, res) {
  const parentProblem = Number(req.query.parentProblem);
  const type = Number(req.query.type);
  const createdByUser = Number(req.query.createdByUser);
  const phrase = req.query.phrase;

  const query = {};

  if (parentProblem) query.problem = parentProblem;
  if (type) query.stage = type;
  if (createdByUser) query.createdByUser = createdByUser;
  if (phrase) query.phrase = phrase;

  return PublicationsModel.findPublications(query, (publicationErr, publicationData) => {
    if (publicationErr) {
      return res.send('ERROR');
    }

    return res.json({ total: publicationData.length, results: publicationData });
  });
}

module.exports = {
  getPublicationByID,
  findPublications,
};

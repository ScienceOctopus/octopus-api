const PublicationsLib = require('../../lib/publications');

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

  return PublicationsLib.getPublicationByID(publicationID, (publicationErr, publicationData) => {
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
  const problemID = Number(req.query.problemID);
  const stageID = Number(req.query.stageID);
  const createdByUser = Number(req.query.createdByUser);

  const query = {};

  if (problemID) query.problem = problemID;
  if (stageID) query.stage = stageID;
  if (createdByUser) query.createdByUser = createdByUser;

  return PublicationsLib.findPublications(query, (publicationErr, publicationData) => {
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

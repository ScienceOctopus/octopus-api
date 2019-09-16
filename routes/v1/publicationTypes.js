const PublicationTypesModel = require('../../models/publicationTypes');

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
function getPublicationTypes(req, res) {
  return PublicationTypesModel.getAllTypes((publicationErr, publicationData) => {
    if (publicationErr) {
      return res.send('ERROR');
    }

    return res.json({ total: publicationData.length, results: publicationData });
  });
}

module.exports = {
  getPublicationTypes,
};

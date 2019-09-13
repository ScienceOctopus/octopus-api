const PublicationsLib = require('../../lib/publications');

/**
 * @api {get} /api/v1/publications/getById/:id Get Publication by ID
 * @apiName getPublicationByID
 * @apiGroup Publications
 * @apiVersion 1.0.0
 * @apiSampleRequest /api/v1/publications/getById/:id
 *
 * @apiParam {Number} id Publication's unique ID.
 *
 * @apiSuccess {Integer} id Unique identifier
 * @apiSuccess {Integer} problem ID of the Problem to which this Publication unit belongs
 * @apiSuccess {Integer} stage ID of that Problem's stage (hypothesis, etc)
 * @apiSuccess {String} title Title of the Publication unit
 * @apiSuccess {String} summary Summary of the Publication unit
 * @apiSuccess {String} text Full text of the Publication unit
 * @apiSuccess {Array} files Files uploaded by the authors at all stages of the process
 * @apiSuccess {String} status Indicates status of the publication (DRAFT / LIVE / ARCHIVED / FINAL / PUBLISHED)
 * @apiSuccess {Integer} revision Indicates the revision of this Publication unit
 * @apiSuccess {String} metaFunding Information about funding body
 * @apiSuccess {String} metaConflict Information about conflict of interest
 * @apiSuccess {String} metaEditor Information about editor
 * @apiSuccess {Integer} createdByUser ID of User who created this Publication unit
 * @apiSuccess {String} dateCreated Date of Publication unit creation
 * @apiSuccess {String} dateLastActivity Date of last activity in the Publication unit
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

module.exports = {
  getPublicationByID,
};

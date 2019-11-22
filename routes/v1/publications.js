const _ = require('lodash');
const debug = require('debug');
const PublicationsModel = require('../../models/publications');
const ObjectID = require('../../lib/mongo').ObjectID;
const PDFDocument = require('pdfkit');
const http = require('http');
const fs = require('fs');
const path = require('path');
/**
 * @api {post} /v1/publications/createPublication Create a Publication
 * @apiName createPublication
 * @apiGroup Publications
 * @apiVersion 1.0.0
 * @apiSampleRequest /v1/publications/createPublication
 *
 * @apiParam {Object} data Publication's data.
 *
 * @apiUse PublicationObject
 */
function createPublication(req, res) {
  const publicationData = _.merge({}, req.body);

  return PublicationsModel.createPublication(publicationData, (publicationErr, publicationResult) => {
    if (publicationErr) {
      debug('octopus:api:error')(`Error in createPublication: ${publicationErr}`);
      debug('octopus:api:error')(`Error in createPublication data: ${publicationData}`);
      return res.send('ERROR');
    }

    return res.json(publicationResult);
  });
}

/**
 * @api {post} /v1/publications/updatePublication Update a Publication
 * @apiName updatePublication
 * @apiGroup Publications
 * @apiVersion 1.0.0
 * @apiSampleRequest /v1/publications/updatePublication
 *
 * @apiParam {Object} data Publication's data.
 *
 * @apiUse PublicationObject
 */
function updatePublication(req, res) {
  const publicationData = _.merge({}, req.body);
  publicationData._id = ObjectID(publicationData._id);

  return PublicationsModel.updatePublication(publicationData, (publicationErr, publicationResult) => {
    if (publicationErr) {
      debug('octopus:api:error')(`Error in updatePublication: ${publicationErr}`);
      debug('octopus:api:error')(`Error in updatePublication data: ${publicationData}`);
      return res.send('ERROR');
    }

    return res.json(publicationResult);
  });
}

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
  const publicationID = String(req.params.id);

  return PublicationsModel.getPublicationByID(publicationID, (publicationErr, publicationData) => {
    if (publicationErr) {
      debug('octopus:api:error')(`Error in getPublicationByID for ${publicationID}: ${publicationErr}`);
      return res.send('ERROR');
    }

    return res.json(publicationData);
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
  const query = {
    parentProblem: Number(req.query.parentProblem),
    createdByUser: req.query.createdByUser,
    type: req.query.type,
    status: req.query.status,
    phrase: req.query.phrase,
  };

  return PublicationsModel.findPublications(query, (publicationErr, publicationData) => {
    if (publicationErr) {
      debug('octopus:api:error')(`Error in findPublications: ${publicationErr}`);
      debug('octopus:api:error')(`Error in findPublications query: ${query}`);
      return res.send('ERROR');
    }

    return res.json({ total: publicationData.length, results: publicationData });
  });
}

function downloadPublication(req, res) {
  const { id: publicationID } = req.params;

  const publicationData = PublicationsModel.getPublicationByID(publicationID, (publicationErr, publicationData) => {
    if (publicationErr) {
      debug('octopus:api:error')(`Error in getPublicationByID for ${publicationID}: ${publicationErr}`);
      return res.send('ERROR');
    }

    const {
      title,
      revision,
      dateCreated,
      summary,
      text,
      createdByUser,
      collaborators
    } = publicationData;

    const doc = new PDFDocument();
    let filename = title;
    // Stripping special characters
    filename = encodeURIComponent(filename) + '.pdf';

    // Setting response to 'attachment' (download).
    // If you use 'inline' here it will automatically open the PDF
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');
    doc.y = 300;
    doc.text(summary, 50, 50);
    // doc.pipe(res);
console.log('filename',filename);
    doc.pipe(fs.createWriteStream(`/tmp/${filename}`))
    .on('finish', function () {
        console.log('PDF closed');
    });
    doc.pipe(res);
    doc.end();

    http.createServer(function(request, response) {
      var filePath = path.join('/tmp/', filename);
      var stat = fs.statSync(filePath);

      response.writeHead(200, {
          'Content-Type': 'audio/mpeg',
          'Content-Length': stat.size
      });

      var readStream = fs.createReadStream(filePath);
      // We replaced all the event handlers with a simple call to readStream.pipe()
      readStream.pipe(response);
  })
  .listen(2000);
  });
}

module.exports = {
  createPublication,
  updatePublication,
  getPublicationByID,
  findPublications,
  downloadPublication,
};

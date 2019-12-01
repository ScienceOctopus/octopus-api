const PDFDocument = require('pdfkit');
const debug = require('debug');
const _ = require('lodash');
const fs = require('fs');

const PublicationsModel = require('../../models/publications');
const ObjectID = require('../../lib/mongo').ObjectID;
const orcid = require('../../lib/orcid');

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

const getUserFullName = (orcidId) => new Promise((resolve) => {
  return orcid.getPersonDetails(orcidId, (personDetailsErr, personDetails) => {
    if (personDetails) {
      // Combine given and family names into fullName
      const givenName = personDetails.name['given-names'];
      const familyName = personDetails.name['family-name'];

      // only the initial for givenName
      const givenNameInitial = givenName && `${givenName.value.charAt(0)}.` ? `${givenName.value.charAt(0)}.` : '';
      const familyNameValue = familyName && familyName.value ? familyName.value : '';
      const fullName = `${givenNameInitial} ${familyNameValue}`;

      // Return it
      resolve({ fullName, orcidId });
    }
    resolve('');
  });
});

function createPublication(req, res) {
  const publicationData = _.merge({}, req.body);

  console.log(publicationData);

  if (publicationData.authors) {
    publicationData.authors = publicationData.authors.split(',');
  }

  if (publicationData.linkedPublications) {
    publicationData.linkedPublications = publicationData.linkedPublications.split(',');
  }

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


/**
 * @api {get} /v1publications/download/:id Download Publication by ID
 * @apiName downloadPublicationByID
 * @apiGroup Publications
 * @apiVersion 1.0.0
 * @apiSampleRequest /v1/publications/getByID/:id
 *
 * @apiParam {Number} id Publication's unique ID.
 *
 * @apiUse PublicationObject
 */

function downloadPublication(req, res) {
  const { id: publicationID } = req.params;

  PublicationsModel.getPublicationByID(publicationID, async (publicationErr, publicationData) => {
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
      authors,
    } = publicationData;

    const authorsListData = [];
    const authorData = await getUserFullName(createdByUser);

    await authors.forEach(async (author) => {
      const data = await getUserFullName(author.orcidID);
      authorsListData.push(data);
    });

    const { baseurl: baseUrl } = req.headers;
    const publicationUrl = `${baseUrl}/publications/view/${publicationID}`;
    const authorUrl = `${baseUrl}/users/view/${authorData.orcidId}`;

    const doc = new PDFDocument({ compress: false });
    const fileName = `${encodeURIComponent(title)}.pdf'`;
    const filePath = `/tmp/${fileName}`;
    const file = fs.createWriteStream(filePath);

    doc.pipe(file);

    // transform "2019-11-13 00:00:00" to "2019-11-13"
    const splittedDate = dateCreated.split(' ')[0];

    // if any error will appear please check:
    // https://stackoverflow.com/questions/5035601/error-running-wkhtmltopdf-error-while-loading-shared-libraries
    // doc
    // .image('../../public/octopus.png', 320, 280, {scale: 0.25})
    // .text('Scale', 320, 265);

    doc
      .fillColor('grey')
      .fontSize(10)
      .text('Publication id: ', 20, 20, {
        continued: true,
      })
      .fillColor('#337ab7')
      .text(publicationID, {
        continued: false,
        link: publicationUrl,
      })
      .fillColor('grey')
      .text(`Date created: ${splittedDate}`)
      .text(`Version number: ${revision}`)
      .text('Authors: ', {
        continued: authorData.fullName ? true : false,
      })
      .fillColor('#337ab7')
      .text(authorData.fullName, {
        continued: false,
        link: authorUrl,
      })
      .fillColor('grey')
      .text('Authors: ', {
        continued: true,
      });

      authorsListData.forEach((author) => {
        const userUrl = `${baseUrl}/users/view/${author.orcidId}`;

        doc
          .fillColor('#337ab7')
          .text(author.fullName, {
            continued: false,
            link: userUrl,
          });
      });

    doc.moveDown();
    doc.moveDown();

    doc
      .fillColor('black')
      .fontSize(20)
      .text(title, {
        align: 'center',
        indent: 30,
      });

    doc.moveDown();

    doc
      .fontSize(16)
      .fillColor('#9955de')
      .text('Summary', 50)
      .fontSize(12)
      .fillColor('black')
      .text(summary, {
        align: 'left',
        indent: 30,
        ellipsis: true,
      });

    doc.moveDown();

    doc
      .fontSize(16)
      .fillColor('#9955de')
      .text('Full Text')
      .fontSize(12)
      .fillColor('black')
      .text(text, {
        align: 'left',
        indent: 30,
        ellipsis: true,
      });

    doc.end();

    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const buffer = Buffer.concat(buffers);
      res.end(buffer, 'binary');
      fs.unlinkSync(filePath);
    });
  });
}

module.exports = {
  createPublication,
  updatePublication,
  getPublicationByID,
  findPublications,
  downloadPublication,
};

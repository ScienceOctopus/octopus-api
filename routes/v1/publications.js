const debug = require('debug');
const _ = require('lodash');
const pdf = require('html-pdf');

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
      text,
      createdByUser,
      collaborators,
    } = publicationData;

    const collaboratorsData = [];
    const authorData = await getUserFullName(createdByUser);

    await collaborators.forEach(async (collaborator) => {
      const data = await getUserFullName(collaborator.orcidID);
      collaboratorsData.push(data);
    });

    const { baseurl: baseUrl } = req.headers;
    let protocol = '';

    if (baseUrl === 'localhost:3000') {
      protocol = 'http://';
    }

    const publicationUrl = `${protocol}${baseUrl}/publications/view/${publicationID}`;
    const authorUrl = `${protocol}${baseUrl}/users/view/${authorData.orcidId}`;

    // transform "2019-11-13 00:00:00" to "2019-11-13"
    const splittedDate = dateCreated.split(' ')[0];

    // if any error will appear please check:
    // https://stackoverflow.com/questions/5035601/error-running-wkhtmltopdf-error-while-loading-shared-libraries
    // doc
    // .image('../../public/octopus.png', 320, 280, {scale: 0.25})
    // .text('Scale', 320, 265);

    let collaboratorsHTML = '';

    if (!_.isEmpty(collaboratorsData)) {
      const numberOfCollabs = collaboratorsData.length;

      collaboratorsData.forEach((collaborator) => {
        const userUrl = `${baseUrl}/users/view/${collaborator.orcidId}`;
        let html;

        if (numberOfCollabs === 1) {
          html = `<a href=${userUrl} target="_blank" style="color: #337ab7; text-decoration: none;">${collaborator.fullName}</a>, `;
        } else {
          html = `<a href=${userUrl} target="_blank" style="color: #337ab7; text-decoration: none;">${collaborator.fullName}</a>`;
        }

        collaboratorsHTML = collaboratorsHTML.concat(html);
      });
    }

    const headerHTML = `
      <div id="pageHeader-first" style="color: grey; font-size: 10px">
        <span>
          Publication id:
          <a href=${publicationUrl} target="_blank" style="color: #337ab7; text-decoration: none;">${publicationID}</a>
        </span>
        <br/>

        <span>
          Date created: ${splittedDate}
        </span>
        <br/>

        <span>
          Version number: ${revision}
        </span>
        <br/>

        <span>
          Authors:
          <a href=${authorUrl} target="_blank" style="color: #337ab7; text-decoration: none;">${authorData.fullName}</a>
        </span>
        <br/>

        <span>
          Collaborators:
          ${collaboratorsHTML}
        </span>
      </div>
    `;

    const contentHTML = `
      <p style="text-align: center; font-size: 20px; text-indent: 30; margin-top: 0"> ${title} </p>
      <p style="font-size: 16px; color: #9955de;"> Full Text </p>
      <p style="font-size: 12px;"> ${text} </p>
    `;

    const html = `
      <div style="font-family:sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%">
        ${headerHTML} ${contentHTML}
      </div>
    `;

    const options = {
      format: 'A4',
      border: {
        top: '0.5cm',
        right: '0.5cm',
        bottom: '0.5cm',
        left: '0.5cm',
      },
    };

    pdf.create(html, options)
      .toStream((err, stream) => {
        if (err) return res.end(err.stack);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${publicationID}.pdf`);

        stream.pipe(res);
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

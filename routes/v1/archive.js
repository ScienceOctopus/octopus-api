
const debug = require('debug');
const _ = require('lodash');

const ArchiveModel = require('../../models/archive');

function createArchive(req, res) {
  const publicationData = _.merge({}, req.body);

  return ArchiveModel.createArchive(publicationData, (archiveErr, archiveResult) => {
    if (archiveErr) {
      debug('octopus:api:error')(`Error in createArchive: ${archiveErr}`);
      debug('octopus:api:error')(`Error in createArchive data: ${publicationData}`);
      return res.send('ERROR');
    }

    return res.json(archiveResult);
  });
}

function getArchive(req, res) {
  const publicationID = _.get(req, 'params.id');
  const revision = _.get(req, 'params.revision');

  return ArchiveModel.getArchive(publicationID, revision, (archiveErr, archiveResult) => {
    if (archiveErr) {
      debug('octopus:api:error')(`Error in getArchive for ${publicationID}: ${archiveErr}`);
      return res.send('ERROR');
    }

    return res.json(archiveResult);
  });
}

module.exports = {
  createArchive,
  getArchive,
};

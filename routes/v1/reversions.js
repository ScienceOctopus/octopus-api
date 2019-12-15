
const debug = require('debug');
const _ = require('lodash');

const ReversionsModel = require('../../models/reversions');

function createReversion(req, res) {
  const publicationData = _.merge({}, req.body);

  return ReversionsModel.createReversion(publicationData, (reversionErr, reversionResult) => {
    if (reversionErr) {
      debug('octopus:api:error')(`Error in createReversion: ${reversionErr}`);
      debug('octopus:api:error')(`Error in createReversion data: ${publicationData}`);
      return res.send('ERROR');
    }

    return res.json(reversionResult);
  });
}

function getReversion(req, res) {
  const publicationID = _.get(req, 'params.id');
  const revision = _.get(req, 'params.revision');

  return ReversionsModel.getReversion(publicationID, revision, (reversionErr, reversionResult) => {
    if (reversionErr) {
      debug('octopus:api:error')(`Error in getReversion for ${publicationID}: ${reversionErr}`);
      return res.send('ERROR');
    }

    if (reversionResult.length) {
      return res.json(_.first(reversionResult));
    }

    return res.json(reversionResult);
  });
}

module.exports = {
  createReversion,
  getReversion,
};

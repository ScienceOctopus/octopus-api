const _ = require('lodash');
const config = require('./config');
const apiAuth = require('./mongo').apiAuth;

function verifyCredentials(key, secret, callback) {
  if (config.bypassAuth) {
    return callback(null, true);
  }

  return apiAuth.find({ key, secret }, (keyPairErr, keyPairData) => {
    const valid = Boolean(_.first(keyPairData));
    return callback(null, valid);
  });
}

module.exports = {
  verifyCredentials,
};

const _ = require('lodash');
const UsersModel = require('../../lib/mongo').users;

function getUserByID(id, callback) {
  return UsersModel.getByID(id, callback);
}

function getUserByORCiD(orcid, callback) {
  return UsersModel.find({ orcid }, (err, data) => {
    return callback(null, _.first(data));
  });
}

function upsertUser(where, data, callback) {
  return UsersModel.updateOne(where, data, (err, data) => {
    return callback(null, data.result.ok === 1);
  });
}

module.exports = {
  getUserByID,
  getUserByORCiD,
  upsertUser,
};

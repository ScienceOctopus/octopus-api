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
  return UsersModel.updateOne(where, data, (err, userData) => {
    return callback(null, userData.result.ok === 1);
  });
}

function insertUser(data, callback) {
  return UsersModel.insertOne(data, callback);
}

function insertManyUsers(data, callback) {
  return UsersModel.insertMany(data, callback);
}

module.exports = {
  getUserByID,
  getUserByORCiD,
  upsertUser,
  insertUser,
  insertManyUsers,
};

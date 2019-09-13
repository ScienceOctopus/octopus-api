const UsersModel = require('../mongo').users;

function getUserByID(id, callback) {
  return UsersModel.getById(id, callback);
}

module.exports = {
  getUserByID,
};

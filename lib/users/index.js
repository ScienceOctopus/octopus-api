const UsersModel = require('../mongo').users;

function getUserByID(id, callback) {
  return UsersModel.getByID(id, callback);
}

module.exports = {
  getUserByID,
};

const ProblemsModel = require('../mongo').problems;

function getProblemByID(id, callback) {
  return ProblemsModel.getById(id, callback);
}

module.exports = {
  getProblemByID,
};

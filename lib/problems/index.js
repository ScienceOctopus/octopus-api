const ProblemsModel = require('../mongo').problems;

function getProblemByID(id, callback) {
  return ProblemsModel.getByID(id, callback);
}

module.exports = {
  getProblemByID,
};

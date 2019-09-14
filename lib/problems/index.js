const ProblemsModel = require('../mongo').problems;

function getProblemByID(id, callback) {
  return ProblemsModel.getByID(id, callback);
}

function findProblems(query, callback) {
  return ProblemsModel.find(query, callback);
}


module.exports = {
  getProblemByID,
  findProblems,
};

const StagesModel = require('../mongo').stages;

function getAllStages(callback) {
  return StagesModel.find({}, callback);
}

function getStageByID(id, callback) {
  return StagesModel.getByID(id, callback);
}

module.exports = {
  getAllStages,
  getStageByID,
};

const ProblemsLib = require('../../lib/problems');

/**
 * @api {get} /api/v1/problems/getById/:id Get Problem by ID
 * @apiName getProblemByID
 * @apiGroup Problems
 * @apiVersion 1.0.0
 * @apiSampleRequest /api/v1/problems/getById/:id
 *
 * @apiParam {Number} id Problem's unique ID.
 *
 * @apiSuccess {Integer} id Unique identifier
 * @apiSuccess {String} title Title of the problem
 * @apiSuccess {String} summary Summary of the problem
 * @apiSuccess {String} createdByUser ID of user who created the Problem
 * @apiSuccess {String} dateCreated Date of Problem's creation
 * @apiSuccess {Integer} dateLastActivity Date of Problem's last activity
 */
function getProblemByID(req, res) {
  const problemID = req.params.id;

  return ProblemsLib.getProblemByID(problemID, (problemErr, problemData) => {
    if (problemErr) {
      return res.send('ERROR');
    }

    return res.send(problemData);
  });
}

module.exports = {
  getProblemByID,
};

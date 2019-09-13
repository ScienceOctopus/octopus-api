const ProblemsLib = require('../../lib/problems');

/**
 * @api {get} /v1/problems/getByID/:id Get Problem by ID
 * @apiName getProblemByID
 * @apiGroup Problems
 * @apiVersion 1.0.0
 * @apiSampleRequest /v1/problems/getByID/:id
 *
 * @apiParam {Number} id Problem's unique ID.
 *
 * @apiUse ProblemObject
 */
function getProblemByID(req, res) {
  const problemID = Number(req.params.id);

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

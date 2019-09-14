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

/**
 * @api {get} /v1/problems/find Find Problems based on specified criteria
 * @apiName findProblems
 * @apiGroup Publications
 * @apiVersion 1.0.0
 * @apiSampleRequest /v1/problems/find
 *
 * @apiParam {Integer} createdByUser ID of User who created the publication
 *
 * @apiSuccess {Array} results Array containing Problems matching the specified criteria
 */
function findProblems(req, res) {
  const createdByUser = Number(req.query.createdByUser);

  const query = {};

  if (createdByUser) query.createdByUser = createdByUser;

  return ProblemsLib.findProblems(query, (publicationErr, publicationData) => {
    if (publicationErr) {
      return res.send('ERROR');
    }

    return res.json({ total: publicationData.length, results: publicationData });
  });
}

module.exports = {
  getProblemByID,
  findProblems,
};

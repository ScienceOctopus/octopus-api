const UsersModel = require('../../models/users');

/**
 * @api {get} /v1/users/getByID/:id Get User by ID
 * @apiName getUserByID
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiSampleRequest /v1/users/getByID/:id
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiUse UserObject
 */
function getUserByID(req, res) {
  const userID = Number(req.params.id);

  return UsersModel.getUserByID(userID, (userErr, userData) => {
    if (userErr) {
      return res.send(`ERROR: ${userErr}`);
    }

    return res.send(userData);
  });
}

module.exports = {
  getUserByID,
};

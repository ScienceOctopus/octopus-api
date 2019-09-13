const UsersLib = require('../../lib/users');

/**
 * @api {get} /api/v1/users/getById/:id Get User by ID
 * @apiName getUserByID
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiSampleRequest /api/v1/users/getById/:id
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiSuccess {Integer} id Unique identifier
 * @apiSuccess {String} title Email
 * @apiSuccess {String} summary Name to use for displaying
 * @apiSuccess {String} createdByUser Date of user account creation
 * @apiSuccess {String} dateCreated Date of user's last activity
 * @apiSuccess {Integer} dateLastActivity Group to which user belongs
 */
function getUserByID(req, res) {
  const userID = req.params.id;

  return UsersLib.getUserByID(userID, (userErr, userData) => {
    if (userErr) {
      return res.send(`ERROR: ${userErr}`);
    }

    return res.send(userData);
  });
}

module.exports = {
  getUserByID,
};

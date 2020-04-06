const debug = require('debug');
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
  const userID = String(req.params.id);

  return UsersModel.getUserByID(userID, (userErr, userData) => {
    if (userErr) {
      debug('octopus:api:error')(`Error in getUserByID(${userID}): ${userErr}`);
      return res.send('ERROR');
    }

    return res.send(userData);
  });
}
/**
 * @api {get} /v1/users/getByORCiD/:orcid Get User by ORCiD
 * @apiName getUserByORCiD
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiSampleRequest /v1/users/getByORCiD/:id
 *
 * @apiParam {string} orcid User's ORCiD
 *
 * @apiUse UserObject
 */
function getUserByORCiD(req, res) {
  const orcid = String(req.params.orcid);

  return UsersModel.getUserByORCiD(orcid, (userErr, userData) => {
    if (userErr) {
      debug('octopus:api:error')(`Error in getUserByID(${orcid}): ${userErr}`);
      return res.send('ERROR');
    }

    return res.send(userData);
  });
}

/**
 * @api {post} /v1/users/upsert Update or insert user entry
 * @apiName upsertUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiSampleRequest /v1/users/upsert
 *
 * @apiParam {object} where query to select data
 * @apiParam {object} data data to insert/update
 *
 * @apiUse UserObject
 */
function upsertUser(req, res) {
  const actualData = Object.keys(req.body)[0];
  const newData = JSON.parse(actualData);
  debug('octopus:api:trace')(`Upserting user: ${newData}`);

  if (!newData || !newData.where || !newData.data) {
    debug('octopus:api:error')(`Incomplete data provided for upsertUser: ${newData}`);
    return res.send('ERROR: "where" and "data" must be defined');
  }

  return UsersModel.upsertUser(newData.where, newData.data, (userErr, userData) => {
    if (userErr) {
      debug('octopus:api:error')(`Error in upsertUser: ${userErr}`);
      return res.send('ERROR');
    }

    return res.json(userData);
  });
}

/**
 * @api {post} /v1/users/insert Insert a User
 * @apiName insertUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiSampleRequest /v1/users/insert
 *
 * @apiParam {object} data User's data
 *
 * @apiUse UserObject
 */

function insertUser(req, res) {
  const userData = req.body;

  return UsersModel.insertUser((userData), (userErr, insertUserResult) => {
    if (userErr) {
      debug('octopus:api:error')(`Error in insertUser: ${userErr}`);
      debug('octopus:api:error')(`Error in insertUser data: ${userData}`);
      return res.send('ERROR');
    }

    return res.json(insertUserResult);
  });
}

/**
 * @api {post} /v1/users/insertMany Insert a Multiple Users
 * @apiName insertManyUsers
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiSampleRequest /v1/users/insertMany
 *
 * @apiParam {object} data User's data
 *
 * @apiUse UserObject
 */

function insertManyUsers(req, res) {
  const userData = req.body;

  return UsersModel.insertManyUsers((userData), (userErr, insertManyUsersResult) => {
    if (userErr) {
      debug('octopus:api:error')(`Error in insertManyUsers: ${userErr}`);
      debug('octopus:api:error')(`Error in insertManyUsers data: ${userData}`);
      return res.send('ERROR');
    }

    return res.json(insertManyUsersResult);
  });
}


module.exports = {
  getUserByID,
  getUserByORCiD,
  upsertUser,
  insertUser,
  insertManyUsers,
};

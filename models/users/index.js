const UsersModel = require('../../lib/mongo').users;

function getUserByID(id, callback) {
  return UsersModel.getByID(id, callback);
}

module.exports = {
  getUserByID,
};



// module.exports = {
//   getUserByID,
//   // getAllUsers: _.noop(),
//   // getUserAvatar: _.noop(),
//   // getNotificationsForUser: _.noop(),
//   // removeUserNotification: _.noop(),
//   // removeNotificationsByUserAndPublication: _.noop(),
//   // removeUserNotifications: _.noop(),
//   // getSignoffsForUser: _.noop(),
// };


// selectUsers: (id) => knex('users')
//   .select()
//   .where('id', id),
//
// selectUsersByEmail: (email) => knex('users')
//   .select()
//   .where('email', email),
//
//
// selectUsersByOrcID: (orc) => knex('users')
//   .select()
//   .where('orcid', orc),
//
//
// selectUsersBySearchQuery: (q) => knex('users')
//   .select()
//   .whereRaw('lower(email) like ?', `%${q.toLowerCase()}%`)
//   .orWhereRaw('lower(display_name) like ?', `%${q.toLowerCase()}%`),
//
//
// insertOrUpdateUser: (orcid, name, primary_email) => knex('users')
//   .insert({
//     email: primary_email,
//     orcid,
//     display_name: name,
//     user_group: 1,
//   })
//   .onConflictUpdate('orcid', 'display_name', 'email')
//   .returning('id'),

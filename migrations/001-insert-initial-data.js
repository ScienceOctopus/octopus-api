const _ = require('lodash');
const UserModel = require('../models/users');
const PubTypesModel = require('../lib/mongo').publicationTypes;
const pubTypes = require('./sampleData/publicationTypes');

const dataUser = {
  orcid: '0000-0000-0000-0000',
  email: 'admin@science-octopus.org',
  name: 'Octopus Admin',
  dateCreated: '2019-09-01 00:00:00.000',
  dateLastActivity: '2019-09-01 00:00:00.000',
  userGroup: 1,
};

function insertAdminUser(callback) {
  UserModel.getUserByORCiD(dataUser.orcid, (err, user) => {
    if (user) {
      console.log('User "Octopus Admin" already exists');
      return callback();
    }

    console.log('Inserting "Octopus Admin" user');
    UserModel.insertUser(dataUser, (err, data) => {
      if (err) {
        console.log('Error:', err);
        callback();
      }
      console.log('Inserted "Octopus Admin" user');
      callback();
    });
  });
}

function insertPublicationTypes(callback) {
  PubTypesModel.find({}, (err, data) => {
    const missingTypes = _.differenceBy(pubTypes, data, 'key');
    if (!missingTypes.length) {
      console.log('All required publication types exist');
      callback();
    }

    PubTypesModel.insertMany(missingTypes, (err, data) => {
      if (err) {
        console.log('Error:', err);
        callback();
      }
      console.log('Inserted missing publication types:', _.map(missingTypes, 'key').join(', '));
      callback();
    });

    // console.log('Inserting publication types');
    // Models.publicationTypes.insertMany(publicationTypes, (err, data) => {
    //   if (err) {
    //     console.log('Error:', err);
    //   }
    //   console.log(`Inserted ${data.insertedCount} publication types.`);
    // });
  });
}

insertAdminUser(() => {
  insertPublicationTypes(() => {
    process.exit(0);
  });
});

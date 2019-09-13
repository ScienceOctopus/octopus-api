const Models = require('./lib/mongo');

const user = {
  id: 1,
  email: 'admin@science-octopus.org',
  displayName: 'Octopus Admin',
  dateCreated: '2019-09-01 00:00:00.000',
  dateLastActivity: '2019-09-01 00:00:00.000',
  userGroup: 1,
};

const problem = {
  id: 1,
  title: 'Problem Ttile goes here',
  summary: 'Problem Summary goes here',
  createdByUser: 1,
  dateCreated: '2019-09-01 00:00:00.000',
  dateLastActivity: '2019-09-01 00:00:00.000',
};

const publication = {
  id: 1,
  problem: 1,
  stage: 1,

  title: 'Publication Title goes here',
  summary: 'Publication Summary goes here',
  text: 'Publication Text goes here',
  files: [],

  status: 'LIVE',
  revision: 1,

  metaFunding: '',
  metaConflict: '',
  metaEditor: '',

  createdByUser: 1,
  dateCreated: '2019-09-01 00:00:00.000',
  dateLastActivity: '2019-09-01 00:00:00.000',
};

//

console.log('Inserting sample user');

Models.users.insertOne(user, (err, data) => {
  if (err) {
    console.log('Error:', err);
  }

  console.log(`Inserted ${data.insertedCount} user. ID: ${data.insertedId}`);
});

//

console.log('Inserting sample problem');

Models.problems.insertOne(problem, (err, data) => {
  if (err) {
    console.log('Error:', err);
  }

  console.log(`Inserted ${data.insertedCount} problem. ID: ${data.insertedId}`);
});

//

console.log('Inserting sample publication unit');

Models.publications.insertOne(publication, (err, data) => {
  if (err) {
    console.log('Error:', err);
  }

  console.log(`Inserted ${data.insertedCount} publication unit. ID: ${data.insertedId}`);
});

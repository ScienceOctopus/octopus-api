const Models = require('../lib/mongo');

const apiAuth = require('./sampleData/apiAuth');
const publications = require('./sampleData/publications');
const publicationTypes = require('./sampleData/publicationTypes');
const ratings = require('./sampleData/ratings');
const users = require('./sampleData/users');

console.log('Inserting users');
Models.users.insertMany(users, (err, data) => {
  if (err) {
    console.log('Error:', err);
  }
  // console.log(`Inserted ${data.insertedCount} users.`);
});

console.log('Inserting publication types');
Models.publicationTypes.insertMany(publicationTypes, (err, data) => {
  if (err) {
    console.log('Error:', err);
  }
  // console.log(`Inserted ${data.insertedCount} publication types.`);
});

console.log('Inserting publications');
Models.publications.insertMany(publications, (err, data) => {
  if (err) {
    console.log('Error:', err);
  }
  // console.log(`Inserted ${data.insertedCount} publications.`);
});

console.log('Inserting ratings');
Models.ratings.insertMany(ratings, (err, data) => {
  if (err) {
    console.log('Error:', err);
  }
  // console.log(`Inserted ${data.insertedCount} ratings.`);
});

console.log('Inserting auth clients');
Models.apiAuth.insertMany(apiAuth, (err, data) => {
  if (err) {
    console.log('Error:', err);
  }
  // console.log(`Inserted ${data.insertedCount} users.`);
});

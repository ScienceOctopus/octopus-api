const Models = require('../lib/mongo');

const users = require('./sampleData/users');
const publicationTypes = require('./sampleData/publicationTypes');
const publications = require('./sampleData/publications');
const ratings = require('./sampleData/ratings');

console.log('Inserting users');
Models.users.insertMany(users, (err, data) => {
  if (err) {
    console.log('Error:', err);
  }
  console.log(`Inserted ${data.insertedCount} users.`);
});


console.log('Inserting publication types');
Models.publicationTypes.insertMany(publicationTypes, (err, data) => {
  if (err) {
    console.log('Error:', err);
  }
  console.log(`Inserted ${data.insertedCount} publication types.`);
});


console.log('Inserting publications');
Models.publications.insertMany(publications, (err, data) => {
  if (err) {
    console.log('Error:', err);
  }
  console.log(`Inserted ${data.insertedCount} publications.`);
});

console.log('Inserting ratings');
Models.ratings.insertMany(ratings, (err, data) => {
  if (err) {
    console.log('Error:', err);
  }
  console.log(`Inserted ${data.insertedCount} ratings.`);
});

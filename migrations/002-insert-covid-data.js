const _ = require('lodash');
const ArchiveModel = require('../lib/mongo').archive;
const PublicationsModel = require('../lib/mongo').publications;
const RelatedPublicationsModel = require('../lib/mongo').relatedPublications;

const dataArchive = require('./sampleData/covid/archive');
const dataPublications = require('./sampleData/covid/publications');
const dataRelatedPublications = require('./sampleData/covid/relatedPublications');

function insertArchive(callback) {
  ArchiveModel.find({}, (err, data) => {
    const missingItems = _.differenceBy(dataArchive, data, '_id');
    if (!missingItems.length) {
      console.log('All initial COVID archived publications exist');
      callback();
    }

    ArchiveModel.insertMany(missingItems, (err, data) => {
      if (err) {
        console.log('Error:', err);
        callback();
      }
      console.log('Inserted missing archived publications:\n', _.map(missingItems, '_id').join('\n'));
      callback();
    });
  });
}


function insertPublications(callback) {
  PublicationsModel.find({}, (err, data) => {
    const missingItems = _.differenceBy(dataPublications, data, 'title');
    if (!missingItems.length) {
      console.log('All initial COVID publications exist');
      callback();
    }

    PublicationsModel.insertMany(missingItems, (err, data) => {
      if (err) {
        console.log('Error:', err);
        callback();
      }
      console.log('Inserted missing publications:\n', _.map(missingItems, 'title').join('\n'));
      callback();
    });
  });
}


function insertRelatedPublications(callback) {
  RelatedPublicationsModel.find({}, (err, data) => {
    const missingItems = _.differenceBy(dataRelatedPublications, data, 'relatedTo');
    if (!missingItems.length) {
      console.log('All initial COVID related publications exist');
      callback();
    }

    RelatedPublicationsModel.insertMany(missingItems, (err, data) => {
      if (err) {
        console.log('Error:', err);
        callback();
      }
      console.log('Inserted missing related publications:\n', _.map(missingItems, 'relatedTo').join('\n'));
      callback();
    });
  });
}


insertArchive(() => {
  insertPublications(() => {
    insertRelatedPublications(() => {
      process.exit(0);
    });
  });
});

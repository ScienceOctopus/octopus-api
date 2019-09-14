/**
 * Mongo adapter
 */
const MongoClient = require('mongodb').MongoClient;
const debug = require('debug');
const config = require('./config');

const mongoUrl = config.mongoUrl;
const mongoDbName = config.mongoDbName;

/**
 * Creates a Mongo connection
 *
 * @param {function} callback Signature: (err, db)
 */
function getClient(callback) {
  MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err || !client) {
      debug('octopus:api:error')(`Couldn't connect to Mongo at ${mongoUrl}`);
      if (err) {
        debug('octopus:api:error')(err);
      }
      return callback(err);
    }

    // const db = client;
    // db.close = client.close;

    // console.log('Connected to Mongo server');
    // return callback(null, db);
    return callback(null, client);
  });
}

/**
 * Base model to instantiate a collection-specific model
 *
 * @param {string} collectionName A name of collection to use
 */
function Model(collectionName) {
  if (!mongoUrl) {
    return undefined;
  }

  if (typeof collectionName !== 'string' || !collectionName.length) {
    throw new Error('Collection name provided to base model needs to be a string.');
  }

  const rtnModelObject = {
    _type: 'mongo',
    insertOne: function insertOne(data, callback) {
      getClient((error, client) => {
        const db = client.db(mongoDbName);
        if (error) {
          console.log(error);
          return callback(error);
        }
        const col = db.collection(collectionName);

        return col.insertOne(data, (err, r) => {
          // console.log(r.upsertedId._id);
          client.close();
          return callback(err, r);
        });
      });
    },

    insertMany: function insertMany(data, callback) {
      getClient((error, client) => {
        const db = client.db(mongoDbName);
        if (error) {
          console.log(error);
          return callback(error);
        }
        const col = db.collection(collectionName);

        return col.insertMany(data, { multi: true }, (err, r) => {
          // console.log(r.upsertedId._id);
          client.close();
          return callback(err, r);
        });
      });
    },

    updateOne: function updateOne(whereQuery, data, callback) {
      getClient((error, client) => {
        const db = client.db(mongoDbName);
        if (error) {
          console.log(error);
          return callback(error);
        }
        const col = db.collection(collectionName);

        return col.updateOne(whereQuery, { $set: data }, { upsert: true }, (err, r) => {
          console.log(err);
          // console.log(r.upsertedId._id);
          client.close();
          return callback(err, r);
        });
      });
    },

    getByID: function getByID(id, callback) {
      getClient((error, client) => {
        const db = client.db(mongoDbName);
        const col = db.collection(collectionName);

        return col.find({ id }).limit(1).toArray((err, reply) => {
          client.close();
          return callback(err, (reply && reply.length ? reply[0] : null));
        });
      });
    },


    find: function find(query, callback) {
      getClient((error, client) => {
        const db = client.db(mongoDbName);
        const col = db.collection(collectionName);

        return col.find(query).toArray((err, reply) => {
          debug('octopus:api:trace')(`Returning ${reply.length} results from ${collectionName}`);
          client.close();
          return callback(err, reply);
        });
      });
    },

    count: function count(query, callback) {
      getClient((error, client) => {
        const db = client.db(mongoDbName);
        const col = db.collection(collectionName);

        return col.countDocuments(query, (err, reply) => {
        // col.estimatedDocumentCount(query, (err, reply) => {
          client.close();
          return callback(err, reply);
        });
      });
    },

    deleteOne: function deleteOne(query, callback) {
      getClient((error, client) => {
        const db = client.db(mongoDbName);
        const col = db.collection(collectionName);

        return col.deleteOne(query, (err, reply) => {
          client.close();
          return callback(null, reply);
        });
      });
    },
  };

  return rtnModelObject;
}

const models = {
  publications: new Model('publications'),
  publicationTypes: new Model('publicationTypes'),
  users: new Model('users'),
  files: new Model('files'),
  ratings: new Model('ratings'),
};

module.exports = models;

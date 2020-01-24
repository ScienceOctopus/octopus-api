const _ = require('lodash');
const debug = require('debug');

const FilesModel = require('../../lib/mongo').files;
const S3Lib = require('../../lib/s3');
const FileLib = require('../../lib/file');

function getFile(id, callback) {
  return FilesModel.getByID(id, callback);
}

function getFileContent(id, callback) {
  return getFile(id, (fileErr, fileData) => {
    const fileParams = {
      Bucket: fileData.s3Bucket,
      Key: fileData.s3Filename,
    };

    S3Lib.getFileContent(fileParams, (s3GetError, s3GetFileContent) => {
      if (s3GetError) {
        debug('octopus:api:error')(s3GetError);
        return callback(s3GetError);
      }

      return callback(null, s3GetFileContent);
    });
  });
}

function extractContentFromLocalFile(filepath, opts, callback) {
  console.log(`extractContentFromLocalFile ${filepath}`);

  FileLib.convertToHtml(filepath, opts, (err, data) => {
    // console.log('err', err);
    // console.log('data', data);
    callback(err, data);
  });
}

function insertFile(filedata, callback) {
  extractContentFromLocalFile(filedata.path, filedata, (extractError, extractData) => {
    const newFileData = _.merge({}, filedata, { text: extractData });

    return S3Lib.upload(filedata.path, filedata.filename, (uploadErr, uploadData) => {
      if (uploadErr) {
        debug('octopus:api:error')(`Error inserting to S3: ${uploadErr}`);
        return callback(uploadErr);
      }

      newFileData.s3Bucket = uploadData.s3Bucket;
      newFileData.s3Filename = uploadData.s3Filename;
      delete newFileData.path;

      debug('octopus:api:debug')('Successfully uploaded to S3');

      return FilesModel.insertOne(newFileData, (mongoInsertErr, mongoInsertData) => {
        if (mongoInsertErr || mongoInsertData.result.ok !== 1) {
          debug('octopus:api:error')(`Error inserting to Mongo: ${mongoInsertErr}`);
          return callback(mongoInsertErr);
        }

        debug('octopus:api:debug')('Successfully inserted file reference in Mongo');
        return callback(null, newFileData);
      });
    });
  });
}

module.exports = {
  getFile,
  getFileContent,
  insertFile,
  extractContentFromLocalFile,
};

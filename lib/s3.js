const aws = require('aws-sdk');
const debug = require('debug');
const fs = require('fs');

const AWS_KEY = process.env.AWS_KEY;
const AWS_SECRET = process.env.AWS_SECRET;
const AWS_REGION = process.env.AWS_REGION;
const AWS_BUCKET = process.env.AWS_BUCKET;

function initialise() {
  aws.config.update({
    region: AWS_REGION,
    accessKeyId: AWS_KEY,
    secretAccessKey: AWS_SECRET,
  });

  const s3Instance = new aws.S3();
  return s3Instance;
}

function upload(filepath, filename, callback) {
  const s3 = initialise();

  const newFilename = `${Date.now().toString()}-${filename || 'default-filename.txt'}`;

  fs.readFile(filepath, (fileReadErr, fileContent) => {
    if (fileReadErr) {
      debug('octopus:api:error')(`Error uploading data: ${fileReadErr}`);
      return callback(fileReadErr);
    }

    const params = {
      Bucket: AWS_BUCKET,
      Key: newFilename,
      Body: fileContent,
    };

    return s3.putObject(params, (s3UploadError, s3UploadResult) => {
      if (s3UploadError) {
        debug('octopus:api:error')(`Error uploading data: ${s3UploadError}`);
        return callback(s3UploadError);
      }

      const etag = s3UploadResult && s3UploadResult.ETag ? s3UploadResult.ETag : null;

      debug('octopus:api:debug')(`Successfully uploaded file to S3 with ETag: ${etag}`);
      return callback(null, {
        s3Filename: newFilename,
        s3Bucket: AWS_BUCKET,
        etag,
      });
    });
  });
}

function getFileContent(getParams, callback) {
  const s3 = initialise();

  return s3.getObject(getParams, (s3GetError, s3GetData) => {
    if (s3GetError) {
      debug('octopus:api:error')(s3GetError);
      return callback(s3GetError);
    }

    const parsedData = s3GetData.Body.toString();

    return callback(null, parsedData);
  });
}

module.exports = {
  initialise,
  upload,
  getFileContent,
};

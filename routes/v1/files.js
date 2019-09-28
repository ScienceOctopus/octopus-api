const _ = require('lodash');
const debug = require('debug');
const formidable = require('formidable');
const fs = require('fs');

const config = require('../../lib/config');
const FilesModel = require('../../models/files');

/**
 * @api {get} /v1/files/get/:id Get File metadata by ID
 * @apiName getFile
 * @apiGroup Files
 * @apiVersion 1.0.0
 * @apiSampleRequest /v1/files/get/:id/:filename
 *
 * @apiParam {UUID} id File's unique ID.
 */
function getFile(req, res) {
  const fileID = String(req.params.id);
  const filename = req.params.filename;

  if (filename) {
    debug('octopus:api:trace')(`Stripping filename from getFile endpoint: ${req.url}`);
    return res.redirect(`/v1/files/get/${fileID}`);
  }

  return FilesModel.getFile(fileID, (fileErr, fileData) => {
    if (fileErr) {
      debug('octopus:api:error')(`Error in getFile(${fileID}): ${fileErr}`);
      return res.send('ERROR');
    }

    return res.send(fileData);
  });
}

/**
 * @api {get} /v1/files/getContent/:id/:filename Get File by ID
 * @apiName getFileContent
 * @apiGroup Files
 * @apiVersion 1.0.0
 * @apiSampleRequest /v1/files/getContent/:id/:filename
 *
 * @apiParam {UUID} id File's unique ID.
 * @apiParam {String} filename File's actual name (with extension)
 */
function getFileContent(req, res) {
  const fileID = String(req.params.id);
  const filename = req.params.filename;

  return FilesModel.getFile(fileID, (fileErr, fileData) => {
    if (fileErr) {
      debug('octopus:api:error')(`Error in getFileContent(${fileID}): ${fileErr}`);
      return res.send('ERROR');
    }

    if (filename !== fileData.filename) {
      debug('octopus:api:trace')(`Redirecting to correct wrong/missing filename: ${req.url}`);
      return res.redirect(`/v1/files/getContent/${fileID}/${fileData.filename}`);
    }

    return FilesModel.getFileContent(fileID, (fileErr, fileContent) => {
      if (fileErr) {
        debug('octopus:api:error')(`Error in getFileContent(${fileID}): ${fileErr}`);
        return res.send('ERROR');
      }

      return res.send(fileContent);
    });
  });
}


/**
 * @api {post} /v1/files/upload Upload a file
 * @apiName uploadFile
 * @apiGroup Files
 * @apiVersion 1.0.0
 * @apiSampleRequest /v1/files/upload
 *
 * @apiParam {string} linkedPublicationID publication to link to
 * @apiParam {object} document File for publication
 */
function uploadFile(req, res) {
  debug('octopus:api:debug')('Uploading a file');

  const form = new formidable.IncomingForm();
  form.keepExtensions = false;
  form.maxFields = 10;
  form.type = 'multipart';
  form.maxFileSize = config.maxFileSizeMB * 1024 * 1024;

  form.parse(req, (err, fields, files) => {
    if (err) {
      debug('octopus:api:error')(`Error while parsing file upload: ${err}`);
      return res.send('Error while processing file upload.');
    }

    const filesData = [];

    _.forEach(files, (f, key) => {
      const mappedFile = {
        linkedPublicationID: fields.linkedPublicationID,
        filetype: key,
        filesize: f.size,
        filename: f.name.trim(),
        mimetype: f.type,
        lastModifiedDate: f.lastModifiedDate,
        path: f.path,
      };

      filesData.push(mappedFile);
    });

    return FilesModel.insertFile(filesData[0], (fileInsertError, fileInsertData) => {
      if (fileInsertError) {
        debug('octopus:api:error')(`Error in uploadFile: ${fileInsertError}`);
        return res.send('ERROR');
      }

      fs.unlinkSync(filesData[0].path);

      return res.json(fileInsertData);
    });
  });
}

/**
 * GET /v1/files/upload
 *
 * Renders an example form to test uploads
 * Debug method only!
 */
function renderUploadForm(req, res) {
  const formContent = `
  <p>You can test file uploads here.</p>
  <p>This is a debug page which will be removed once the uploads are stabilised.</p>
  <hr />
  <form action="" enctype="multipart/form-data" method="post">
    <label>
      Linked publication ID:
      <input type="text" name="linkedPublicationID">
    </label>

    <br>

    <label>
      File:
      <input type="file" name="document">
    </label>

    <br />

    <input type="submit" value="Upload" >
  </form>`;
  return res.send(formContent);
}

module.exports = {
  getFile,
  getFileContent,
  uploadFile,
  renderUploadForm,
};

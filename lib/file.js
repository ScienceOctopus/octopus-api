const _ = require('lodash');
const fs = require('fs');
const fileType = require('file-type');
const readChunk = require('read-chunk');
const mammothExtract = require('mammoth');
const extractHtml = require('pdf-html-extract');
const md = require('markdown-it')();

function docxToHtml(filepath, callback) {
  mammothExtract
    .convertToHtml({ path: filepath })
    .then((result) => {
      const rtn = result.value;
      return callback(null, rtn);
    })
    .done();
}

// function pdfToHtml(filepath, callback) {
//   pdfExtract(filepath, (err, html) => {
//     const rtn = html.join('<br />');
//     return callback(null, rtn);
//   });
// }

function pdfToHtml(filepath, callback) {
  return extractHtml(filepath, (err, html) => {
    if (err) {
      return callback(err);
    }

    return callback(null, html.join(''));
  });
}

function mdToHtml(filepath, callback) {
  fs.readFile(filepath, (fileReadErr, fileContent) => {
    if (fileReadErr) {
      return callback(fileReadErr);
    }

    const mdText = fileContent.toString();
    const result = md.render(mdText);
    return callback(null, result);
  });
}

function detectFiletypeByMimetype(mimetype) {
  const types = {
    doc: ['application/msword'],
    docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    tex: ['text/x-tex'],
    md: ['text/markdown'],
    pdf: ['application/pdf'],
  };

  return _.any(types, (type) => {
    return _.includes(type, mimetype);
  });
}


function detectFiletypeByExtension(filepath) {
  const filenameSegments = filepath.split('.');
  const lastSegment = _.last(filenameSegments);
  return lastSegment;
}

function detectFiletypeByFileHeader(filepath) {
  const buffer = readChunk.sync(filepath, 0, fileType.minimumBytes);
  const result = fileType(buffer);
  return result && result.ext ? result.ext : null;
}

function convertToHtml(filepath, opts, callback) {
  let type = null;

  console.log(`convertToHtml(${filepath}, ${opts})`);

  if (!type && opts.filename) {
    type = detectFiletypeByExtension(opts.filename);
  }

  if (!type && opts.mimetype) {
    type = detectFiletypeByMimetype(opts.mimetype);
  }

  if (!type) {
    type = detectFiletypeByFileHeader(filepath);
  }

  console.log(`detected type: ${type}`);

  if (type === 'docx') {
    return docxToHtml(filepath, callback);
  }

  if (type === 'pdf') {
    return pdfToHtml(filepath, callback);
  }

  if (type === 'md') {
    return mdToHtml(filepath, callback);
  }

  return callback(`Unsupported filetype (${type}) in ${filepath}`);
}

module.exports = {
  convertToHtml,
};

const _ = require('lodash');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fileType = require('file-type');
const readChunk = require('read-chunk');
const mammothExtract = require('mammoth');
const pdftohtml = require('pdftohtmljs');
const md = require('markdown-it')();
const minify = require('html-minifier').minify;

function uniqueFileName() {
  const randomString = () => Math.random().toString(36).substring(2, 15);
  return `${randomString()}${randomString()}`;
}

function minifyHtml(html) {
  const options = {
    collapseWhitespace: true,
    removeTagWhitespace: true,
    removeEmptyAttributes: true,
    removeRedundantAttributes: true,
    removeOptionalTags: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true,
  };
  return minify(html, options);
}

function docxToHtml(filepath, callback) {
  mammothExtract
    .convertToHtml({ path: filepath })
    .then((result) => {
      const html = minifyHtml(result.value);
      return callback(null, html);
    })
    .done();
}

async function pdfToHtml(filepath, callback) {
  const outputPath = `tmp/${uniqueFileName()}`;
  const getGenerated = (type) => `${outputPath}${type}.html`;
  // Convert
  await exec(`pdftohtml -i -s ${filepath} ${outputPath}`);
  // Read the output
  fs.readFile(getGenerated("-html"), 'utf8', (err, html) => {
    // Cleanup
    fs.unlink(getGenerated("s"), _.noop);
    fs.unlink(getGenerated("-html"), _.noop);
    fs.unlink(getGenerated("-outline"), _.noop);
    // Minify
    const result = minifyHtml(html);
    // Done
    return callback(err, html);
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

const request = require('request');

function getPersonDetails(orcid, callback) {
  const reqUrl = `https://pub.orcid.org/v2.1/${orcid}/person`;
  const headers = {
    Accept: 'application/json',
    'User-Agent': 'Octopus Web App',
  };
  const reqOpts = {
    headers,
  };

  request(reqUrl, reqOpts, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return callback(error || response.statusCode);
    }

    const details = JSON.parse(body);
    return callback(null, details);
  });
}

module.exports = {
  getPersonDetails,
};

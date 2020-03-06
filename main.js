require('dotenv').config();

const bodyParser = require('body-parser');
const debug = require('debug');
const express = require('express');

const auth = require('./lib/auth');
const config = require('./lib/config');

const port = config.appPort;

const app = express();

/* eslint-disable global-require */
const Routes = {
  home: require('./routes/home'),
  v1: {
    Files: require('./routes/v1/files'),
    Publications: require('./routes/v1/publications'),
    RelatedPublications: require('./routes/v1/relatedPublications'),
    RedFlaggedPublications: require('./routes/v1/redFlaggedPublications'),
    Archive: require('./routes/v1/archive'),
    PublicationTypes: require('./routes/v1/publicationTypes'),
    Users: require('./routes/v1/users'),
  },
};
/* eslint-enable global-require */

app.use('/docs', express.static('docs'));
app.use('/public', express.static('public'));

app.get('/', Routes.home);

app.use('/v1', (req, res, next) => {
  auth.verifyCredentials(req.headers.authkey, req.headers.authsecret, (err, success) => {
    if (!success) {
      debug('octopus:api:debug')(`API Authentication failed with ${req.headers.authkey}:${req.headers.authsecret}`);
      return res.send('Authentication required');
    }

    return next();
  });
});

// register file handler first to prevent bodyParser from conflicting with formidable
app.post('/v1/files/upload', Routes.v1.Files.uploadFile);

app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.get('/v1/publicationTypes', Routes.v1.PublicationTypes.getPublicationTypes);

app.post('/v1/publications/create', Routes.v1.Publications.createPublication);
app.post('/v1/archive/create', Routes.v1.Archive.createArchive);
app.get('/v1/publications/getByID/:id', Routes.v1.Publications.getPublicationByID);
app.get('/v1/archive/getByID/:id/:revision', Routes.v1.Archive.getArchive);
app.get('/v1/publications/find', Routes.v1.Publications.findPublications);
app.post('/v1/publications/update', Routes.v1.Publications.updatePublication);
app.get('/v1/publications/download/:id', Routes.v1.Publications.downloadPublication);

app.post('/v1/relatedPublications/create', Routes.v1.RelatedPublications.createRelatedPublication);
app.get('/v1/relatedPublications/find', Routes.v1.RelatedPublications.findRelatedPublications);
app.post('/v1/relatedPublications/update', Routes.v1.RelatedPublications.updateRelatedPublication);

app.post('/v1/redFlagPublication/add', Routes.v1.RedFlaggedPublications.addRedFlaggedPublication);
app.get('/v1/redFlagPublication/getByID/:id', Routes.v1.RedFlaggedPublications.getResolutionByID);
app.post('/v1/redFlagPublication/update', Routes.v1.RedFlaggedPublications.updateResolution);
app.get('/v1/redFlagPublication/find', Routes.v1.RedFlaggedPublications.findResolutions);

app.get('/v1/users/getByID/:id', Routes.v1.Users.getUserByID);
app.get('/v1/users/getByORCiD/:orcid', Routes.v1.Users.getUserByORCiD);
app.post('/v1/users/upsert', Routes.v1.Users.upsertUser);

app.get('/v1/files/get/:id/:filename?', Routes.v1.Files.getFile);
app.get('/v1/files/getContent/:id/:filename?', Routes.v1.Files.getFileContent);
app.get('/v1/files/upload', Routes.v1.Files.renderUploadForm);

app.use((err, _req, res, _next) => {
  debug('octopus:api:error')(err.stack);
  return res.sendStatus(500);
});

app.use((req, res) => {
  debug('octopus:api:error')(`Error 404 on URL: ${req.url}`);
  return res.sendStatus(404);
});

app.listen(port, () => {
  console.log(`Science Octopus API is running on port ${port}.`);
});

require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');

const port = process.env.PORT || 4000;

const app = express();

/* eslint-disable global-require */
const Routes = {
  home: require('./routes/home'),
  v1: {
    Publications: require('./routes/v1/publications'),
    PublicationTypes: require('./routes/v1/publicationTypes'),
    Users: require('./routes/v1/users'),
  },
};
/* eslint-enable global-require */

app.use('/docs', express.static('docs'));
app.use('/public', express.static('public'));

app.use(bodyParser.json());

app.get('/', Routes.home);

app.get('/v1/publicationTypes', Routes.v1.PublicationTypes.getPublicationTypes);

app.get('/v1/publications/getByID/:id', Routes.v1.Publications.getPublicationByID);
app.get('/v1/publications/find', Routes.v1.Publications.findPublications);

app.get('/v1/users/getByID/:id', Routes.v1.Users.getUserByID);

app.use((err, req, res, next) => {
  console.error(err.stack);
  return res.sendStatus(500);
});

app.use((req, res) => {
  return res.sendStatus(404);
});

app.listen(port, () => {
  console.log(`Science Octopus API is running on port ${port}.`);
});

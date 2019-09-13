const bodyParser = require('body-parser');
const express = require('express');

const port = process.env.PORT || 4000;

const app = express();

/* eslint-disable global-require */
const Routes = {
  v1: {
    Problems: require('./routes/v1/problems'),
    Publications: require('./routes/v1/publications'),
    Users: require('./routes/v1/users'),
  },
};
/* eslint-enable global-require */

app.use('/apidocs', express.static('apidocs'));
app.use('/public', express.static('public'));

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Science Octopus API');
});

app.use('/api/v1/problems/getByID/:id', Routes.v1.Problems.getProblemByID);
app.use('/api/v1/publications/getByID/:id', Routes.v1.Publications.getPublicationByID);
app.use('/api/v1/users/getByID/:id', Routes.v1.Users.getUserByID);

app.use((err, req, res) => {
  console.error(err.stack);
  return res.status(500).send('500 Internal Server Error');
});

app.use((req, res) => {
  return res.sendStatus(404);
});

app.listen(port, () => {
  console.log(`Science Octopus API is running on port ${port}.`);
});

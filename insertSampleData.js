const Models = require('./lib/mongo');

const user = {
  id: 1,
  email: 'admin@science-octopus.org',
  displayName: 'Octopus Admin',
  dateCreated: '2019-09-01 00:00:00.000',
  dateLastActivity: '2019-09-01 00:00:00.000',
  userGroup: 1,
};

const problem = {
  id: 1,
  title: 'Example Problem',
  summary: 'Problem Summary goes here',
  createdByUser: 1,
  dateCreated: '2019-09-01 00:00:00.000',
  dateLastActivity: '2019-09-01 00:00:00.000',
};

const publication = {
  id: 1,
  problem: 1,
  stage: 1,

  title: 'Publication Title goes here',
  summary: 'Publication Summary goes here',
  text: 'Publication Text goes here',
  files: [],

  status: 'LIVE',
  revision: 1,

  metaFunding: '',
  metaConflict: '',
  metaEditor: '',

  createdByUser: 1,
  dateCreated: '2019-09-01 00:00:00.000',
  dateLastActivity: '2019-09-01 00:00:00.000',

  tags: [],
  stages: ['Hypotheses', 'Methods/Protocols', 'Data/Results', 'Analyses', 'Interpretations', 'Applications'],
  collaborators: [
    {
      userID: 1,
      role: 'author',
      status: 'CONFIRMED',
      dateAdded: '2019-09-01 00:00:00.000',
    }
  ]
};

const stages = [
  {
    name: 'Hypotheses',
    singular: 'Hypothesis',
    ratingCriteria: ['Well defined', 'Original', 'Scientifically valid'],
  },
  {
    name: 'Methods/Protocols',
    singular: 'Method/Protocol',
    ratingCriteria: ['Details clear', 'Original', 'Appropriate test of hypothesis'],
  },
  {
    name: 'Data/Results',
    singular: 'Data/Result',
    ratingCriteria: ['Well annotated', 'Followed protocol', 'Size of dataset'],
  },
  {
    name: 'Analyses',
    singular: 'Analysis',
    ratingCriteria: ['Details clear', 'Original', 'Appropriate methodology'],
  },
  {
    name: 'Interpretations',
    singular: 'Interpretation',
    ratingCriteria: ['Clearly written', 'Insightful', 'Consistent with data'],
  },
  {
    name: 'Applications',
    singular: 'Application',
    ratingCriteria: ['Details clear', 'Impactful', 'Appropriate'],
  },
];

const review = {
  publicationId: 1,
  ratingFirst: 5,
  ratingSecond: 5,
  ratingThird: 5,
  userID: 5,
  text: '',
  dateCreated: '2019-09-01 00:00:00.000',
};

const file = {
  id: 1234,
  name: 'Test.docx',
  size: 1231231,
  userID: 1,
  publicationID: 1,
  type: 'publication'
};

//

console.log('Inserting sample user');

Models.users.insertOne(user, (err, data) => {
  if (err) {
    console.log('Error:', err);
  }

  console.log(`Inserted ${data.insertedCount} user. ID: ${data.insertedId}`);
});

//

console.log('Inserting sample problem');

Models.problems.insertOne(problem, (err, data) => {
  if (err) {
    console.log('Error:', err);
  }

  console.log(`Inserted ${data.insertedCount} problem. ID: ${data.insertedId}`);
});

//

console.log('Inserting sample publication unit');

Models.publications.insertOne(publication, (err, data) => {
  if (err) {
    console.log('Error:', err);
  }

  console.log(`Inserted ${data.insertedCount} publication unit. ID: ${data.insertedId}`);
});

//

console.log('Inserting file');

Models.files.insertOne(file, (err, data) => {
  if (err) {
    console.log('Error:', err);
  }

  console.log(`Inserted ${data.insertedCount} file. ID: ${data.insertedId}`);
});

//

console.log('Inserting review');

Models.reviews.insertOne(review, (err, data) => {
  if (err) {
    console.log('Error:', err);
  }

  console.log(`Inserted ${data.insertedCount} review. ID: ${data.insertedId}`);
});

//

console.log('Inserting sample stages');

Models.stages.insertMany(stages, (err, data) => {
  if (err) {
    console.log('Error:', err);
  }

  console.log(`Inserted ${data.insertedCount} stages.`);
});

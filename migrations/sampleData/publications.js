const publication1 = {
  id: 1,
  type: 'PROBLEM',
  status: 'LIVE',
  parentProblem: 0,
  parentPublication: 0,
  revision: 1,

  title: 'Democratisation of science publishing',
  summary: 'Science publishing is broken. Octopus aims to fix it.',
  text: 'In this publication we will explore current challenges with science publishing and explore Octopus as a solution to these problems.',

  metaFunding: '',
  metaConflict: '',
  metaEditor: '',

  createdByUser: 1,
  dateCreated: '2019-09-01 00:00:00.000',
  dateLastActivity: '2019-09-01 00:00:00.000',

  tags: [],
  collaborators: [],
};

const publication2 = {
  id: 2,
  type: 'HYPOTHESIS',
  status: 'LIVE',
  parentProblem: 1,
  parentPublication: 1,
  revision: 1,

  title: 'Octopus - science publishing done right.',
  summary: 'Octopus is a new publishing paradigm designed for researchers, by researchers.',
  text: 'Designed to replace journals and papers, Octopus is free to use and gets your work out there much more quickly, to a wider audience and ensures you get maximum credit for the work you do, whether that’s coming up with hypotheses, designing protocols, collecting data, doing analyses or writing reviews.',

  metaFunding: '',
  metaConflict: '',
  metaEditor: '',

  createdByUser: 1,
  dateCreated: '2019-09-01 00:00:00.000',
  dateLastActivity: '2019-09-01 00:00:00.000',

  tags: [],
  collaborators: [
    {
      userID: 1,
      role: 'author',
      status: 'CONFIRMED',
      dateAdded: '2019-09-01 00:00:00.000',
    },
  ],
};

const publications = [
  publication1,
  publication2,
];

module.exports = publications;

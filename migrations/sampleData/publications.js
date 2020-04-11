const publication1 = {
  type: 'PROBLEM',
  status: 'LIVE',
  parentProblems: ['0'],
  parentPublications: ['0'],
  revision: 1,
  title: 'Democratisation of science publishing',
  text: 'In this publication we will explore current challenges with science publishing and explore Octopus as a solution to these problems.',
  fundingStatement: '',
  coiDeclaration: '',
  createdByUser: '0000-0000-0000-0000',
  dateCreated: '2019-09-01 00:00:00.000',
  dateLastActivity: '2019-09-01 00:00:00.000',
  keywords: [],
  collaborators: [
    {
      userID: '0000-0000-0000-0000',
      role: 'author',
      status: 'CONFIRMED',
      dateAdded: '2019-09-01 00:00:00.000',
    },
  ],
};

const publication2 = {
  type: 'HYPOTHESIS',
  status: 'LIVE',
  parentProblems: ['0'],
  parentPublications: ['0'],
  revision: 1,
  title: 'Octopus - science publishing done right.',
  text: 'Designed to replace journals and papers, Octopus is free to use and gets your work out there much more quickly, to a wider audience and ensures you get maximum credit for the work you do, whether that’s coming up with hypotheses, designing protocols, collecting data, doing analyses or writing reviews.',
  fundingStatement: '',
  coiDeclaration: '',
  createdByUser: '0000-0000-0000-0000',
  dateCreated: '2019-09-01 00:00:00.000',
  dateLastActivity: '2019-09-01 00:00:00.000',
  keywords: [],
  collaborators: [
    {
      userID: '0000-0000-0000-0000',
      role: 'author',
      status: 'CONFIRMED',
      dateAdded: '2019-09-01 00:00:00.000',
    },
  ],
};

const publication3 = {
  type: 'PROTOCOL',
  status: 'LIVE',
  parentProblems: ['0'],
  parentPublications: ['0'],
  revision: 1,
  title: 'Testing Octopus',
  text: 'Lorem ipsum dolor sit.',
  fundingStatement: '',
  coiDeclaration: '',
  createdByUser: '0000-0000-0000-0000',
  dateCreated: '2019-09-01 00:00:00.000',
  dateLastActivity: '2019-09-01 00:00:00.000',
  keywords: [],
  collaborators: [
    {
      userID: '0000-0000-0000-0000',
      role: 'author',
      status: 'CONFIRMED',
      dateAdded: '2019-09-01 00:00:00.000',
    },
  ],
};


const publications = [
  publication1,
  publication2,
  publication3,
];

module.exports = publications;

const publicationTypes = [
  {
    key: 'PROBLEM',
    title: 'Problem',
    plural: 'Problems',
    ratingCriteria: ['Well defined', 'Original', 'Important'],
    linksTo: '*',
  },
  {
    key: 'HYPOTHESIS',
    title: 'Hypothesis',
    plural: 'Hypotheses',
    ratingCriteria: ['Well defined', 'Original', 'Scientifically valid'],
    linksTo: ['PROBLEM'],
  },
  {
    key: 'PROTOCOL',
    title: 'Method/Protocol',
    plural: 'Methods/Protocols',
    ratingCriteria: ['Details clear', 'Original', 'Appropriate test of hypothesis'],
    linksTo: ['HYPOTHESIS'],
  },
  {
    key: 'RESULT',
    title: 'Data/Result',
    plural: 'Data/Results',
    ratingCriteria: ['Well annotated', 'Followed protocol', 'Size of dataset'],
    additionalFields: [
      {
        type: 'string',
        name: 'dataRepositoryUrls',
      },
    ],
    linksTo: ['PROTOCOL'],
  },
  {
    key: 'ANALYSIS',
    title: 'Analysis',
    plural: 'Analyses',
    ratingCriteria: ['Details clear', 'Original', 'Appropriate methodology'],
    linksTo: ['RESULT'],
  },
  {
    key: 'INTERPRETATION',
    title: 'Interpretation',
    plural: 'Interpretations',
    ratingCriteria: ['Clearly written', 'Insightful', 'Consistent with data'],
    linksTo: ['ANALYSIS'],
  },
  {
    key: 'APPLICATION',
    title: 'Application',
    plural: 'Applications',
    ratingCriteria: ['Details clear', 'Impactful', 'Appropriate'],
    linksTo: ['INTERPRETATION'],
  },
  {
    key: 'REVIEW',
    title: 'Review',
    plural: 'Reviews',
    ratingCriteria: ['Overall rating'],
    // reviews can't link to another review
    linksTo: ['PROBLEM', 'HYPOTHESIS', 'PROTOCOL', 'RESULT', 'ANALYSIS', 'INTERPRETATION', 'APPLICATION'],
    // reviews should be displayed next to a publication, not a separate column
    attributes: {
      displayInPubChain: false,
    },
  },
];

module.exports = publicationTypes;

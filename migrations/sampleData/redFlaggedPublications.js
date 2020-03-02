const redFlaggedPublications = [
  {
    _id: '',
    publicationID: '', // PublicationID of the publication that was red flagged
    reason: '', // The reason that the publication was red flagged
    description: '', // A comment explaining the issue
    status: '', // Publication's red flag status ( in history or live) // OPEN RESOLVED
    comments: [
      {
        userID: '',
        text: '',
        dateCreated: ''
      }
    ], // Resolution comments
    createdByUser: '', // UserID of the user that red flagged the publication
    dateCreated: '', // When the publication was red flagged
  },
];

module.exports = redFlaggedPublications;

const relatedPublications = [
  {
    _id: '',
    publicationID: '', // PublicationID
    relatedTo: '', // RelatedToPublicationID
    createdByUser: '', // UserID of the user that created the RelatedPublication
    ratings: [
      {
        createdByUser: '', // UserID of the user that rated the RelatedPublication
        rating: '', // One element from [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]
        dateCreated: '', // When the RelatedPublication was rated
      }
    ],
    dateCreated: '' // When the RelatedPublication was created (added to DB)
  }
]
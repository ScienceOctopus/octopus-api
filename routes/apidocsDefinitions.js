/**
 * @apiDefine PublicationObject
 *
 * @apiSuccess {Integer} id Unique identifier
 * @apiSuccess {Integer} problem ID of the Problem to which this Publication unit belongs
 * @apiSuccess {Integer} stage ID of that Problem's stage (hypothesis, etc)
 * @apiSuccess {String} title Title of the Publication unit
 * @apiSuccess {String} text Full text of the Publication unit
 * @apiSuccess {Array} files Files uploaded by the authors at all stages of the process
 * @apiSuccess {String} status Indicates status of the publication (DRAFT / LIVE / ARCHIVED / FINAL / PUBLISHED)
 * @apiSuccess {Integer} revision Indicates the revision of this Publication unit
 * @apiSuccess {String} metaFunding Information about funding body
 * @apiSuccess {String} metaConflict Information about conflict of interest
 * @apiSuccess {String} metaEditor Information about editor
 * @apiSuccess {Integer} createdByUser ID of User who created this Publication unit
 * @apiSuccess {String} dateCreated Date of Publication unit creation
 * @apiSuccess {String} dateLastActivity Date of last activity in the Publication unit
 */

/**
 * @apiDefine RelatedPublicationObject
 * @apiSuccess {Integer} id Unique identifier
 * @apiSuccess {Integer} publicationID Unique identifier for publication
 * @apiSuccess {Integer} relatedTo publication ID of the publication to which this Publication unit belongs
 * @apiSuccess {Integer} createdByUser ID of User who created this Related Publication unit
 * @apiSuccess {Array} ratings of Users who rated this Related Publication unit
 */

/**
 * @apiDefine RedFlaggedPublicationObject
 * @apiSuccess {Integer} id Unique identifier
 * @apiSuccess {Integer} publicationID Unique identifier for publication
 * @apiSuccess {String} reason that the publication was red flagged
 * @apiSuccess {String} description Description of the Resolution
 * @apiSuccess {String} status Indicates status of the resolution (OPEN / RESOLVED)
 * @apiSuccess {Array} comments of Users who commented this Resolution unit
 * @apiSuccess {Integer} createdByUser ID of User who created this Red Flagged Publication unit
 * @apiSuccess {String} dateCreated Date of Red Flag Publication unit creation
 */

/**
 * @apiDefine UserObject
 *
 * @apiSuccess {Integer} id Unique identifier
 * @apiSuccess {String} title Email
 * @apiSuccess {String} summary Name to use for displaying
 * @apiSuccess {String} createdByUser Date of user account creation
 * @apiSuccess {String} dateCreated Date of user's last activity
 * @apiSuccess {Integer} dateLastActivity Group to which user belongs
 */

/**
 * @apiDefine PublicationObject
 *
 * @apiSuccess {Integer} id Unique identifier
 * @apiSuccess {Integer} problem ID of the Problem to which this Publication unit belongs
 * @apiSuccess {Integer} stage ID of that Problem's stage (hypothesis, etc)
 * @apiSuccess {String} title Title of the Publication unit
 * @apiSuccess {String} summary Summary of the Publication unit
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
 * @apiDefine UserObject
 *
 * @apiSuccess {Integer} id Unique identifier
 * @apiSuccess {String} title Email
 * @apiSuccess {String} summary Name to use for displaying
 * @apiSuccess {String} createdByUser Date of user account creation
 * @apiSuccess {String} dateCreated Date of user's last activity
 * @apiSuccess {Integer} dateLastActivity Group to which user belongs
 */

/**
 * @apiDefine ProblemObject
 *
 * @apiSuccess {Integer} id Unique identifier
 * @apiSuccess {String} title Title of the problem
 * @apiSuccess {String} summary Summary of the problem
 * @apiSuccess {String} createdByUser ID of user who created the Problem
 * @apiSuccess {String} dateCreated Date of Problem's creation
 * @apiSuccess {Integer} dateLastActivity Date of Problem's last activity
 */

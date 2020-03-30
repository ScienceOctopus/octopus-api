// Mongo adapter
const MongoClient = require('mongodb').MongoClient;

// DB
const mongoUrl = 'mongodb://localhost:27017';
const mongoDbName = 'octopus';

// Hardcoded Data
const copyrightLicence = ['CC-BY', 'CC-BY-SA', 'CC-BY-ND', 'CC-BY-NC', 'CC-BY-NC-SA', 'CC-BY-NC-ND'];
const status = ['DRAFT', 'LIVE'];
const numberOfPublications = 0; // number of publications to insert
const numberOfUsers = 1; // number of users to insert

// Creates a Mongo connection
MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, async (mongoClientErr, client) => {
  if (mongoClientErr) throw mongoClientErr;

  const db = client.db(mongoDbName);

  for (let i = 1; i <= numberOfUsers; i++) {
    const count = '0000'.substr(String(i).length) + i;

    const userExample = {
      orcid: `0000-0000-0000-${count}`,
      email: `admin-${i}@science-octopus.org`,
      name: `Octopus Admin - ${i}`,
      dateCreated: new Date(),
      dateLastActivity: new Date(),
      userGroup: 1,
    };

    // Insert the User in DB
    await db.collection('users')
      .insertOne(userExample)
      .then((doc) => console.log(`Successfully inserted user ${i}`))
      .catch((err) => console.error('ERROR while inserting User: \n', err));
  }

  for (let i = 1; i <= numberOfPublications; i++) {
    console.log(`Generating publication number ${i} of ${numberOfPublications}`);

    // Choose a random CC Licence from the upper list
    const randomCopyrightLicence = copyrightLicence[Math.floor(Math.random() * copyrightLicence.length)];

    // Choose a random Status from the upper list
    const randomStatus = status[Math.floor(Math.random() * status.length)];

    // Get a random publication type from DB
    const randomPublicationType = await db.collection('publicationTypes')
      .aggregate([{ $sample: { size: 1 } }])
      .toArray()
      .then((doc) => doc[0])
      .catch((err) => console.error('ERROR while aggregating publication types for Publication: \n', err));

    let linkedPublicationFilter = randomPublicationType.linksTo;

    if (randomPublicationType.key === 'PROBLEM') {
      linkedPublicationFilter = ['PROBLEM', 'HYPOTHESIS', 'PROTOCOL', 'RESULT', 'ANALYSIS', 'INTERPRETATION', 'APPLICATION'];
    }

    // Get random publications from DB based on publication type allowance
    const randomLinkedPublications = await db.collection('publications')
      .aggregate([
        { $match: { type: { $in: linkedPublicationFilter } } },
        { $sample: { size: 5 } },
      ])
      .toArray()
      .then((publications) => {
        const linkedPublications = [];
        publications.forEach((publication) => linkedPublications.push(publication._id));

        return linkedPublications;
      })
      .catch((err) => console.error('ERROR while aggregating linked publications: \n', err));


    // Aggregate 5 publications and generate the related publications
    const randomCollaborators = await db.collection('users')
      .aggregate([{ $sample: { size: 7 } }])
      .toArray()
      .then((collaborators) => {
        const randomCollabs = [];

        // Compose RelatedPublications Object
        collaborators.forEach((collaborator) => {
          randomCollabs.push({
            userID: collaborator.orcid,
            role: 'author',
            status: 'UNCONFIRMED',
          });
        });

        return randomCollabs;
      })
      .catch((err) => console.error('ERROR while aggregating Users for Random Collaborators: \n', err));

    const publicationExample = {
      status: randomStatus,
      revision: '1',
      dateCreated: new Date(),
      dateLastActivity: new Date(),
      type: randomPublicationType.key,
      linkedPublications: randomLinkedPublications,
      collaborators: [
        {
          userID: '0000-0000-0000-0000',
          role: 'author',
          status: 'UNCONFIRMED',
        },
        ...randomCollaborators,
      ],
      title: `Octopus Test - ${i}`,
      fileId: '', // TODO: insert file and afterwards complete this field with coresponding fileID
      summary: 'Octopus is a new publishing paradigm designed for researchers, by researchers.',
      text: 'Designed to replace journals and papers, Octopus is free to use and gets your work out there much more quickly, to a wider audience and ensures you get maximum credit for the work you do, whether that’s coming up with hypotheses, designing protocols, collecting data, doing analyses or writing reviews.',
      dataUrl: 'tttttttttttttttt',
      keywords: ['What', 'is', 'Lorem', 'Ipsum?', 'Lorem', 'Ipsum', 'is', 'simply', 'dummy', 'text', 'of', 'the', 'printing', 'and', 'typesetting', 'industry.', 'Lorem', 'Ipsum', 'has', 'been', 'the', 'industry', 'standard', 'dummy', 'text', 'ever', 'since', 'the', '1500s', 'when', 'an', 'unknown', 'printer', 'took', 'a', 'galley', 'of', 'type', 'and', 'scrambled', 'it', 'to', 'make', 'a', 'type', 'specimen', 'book.', 'It', 'has', 'survived', 'not', 'only', 'five', 'centuries', 'but', 'also', 'the', 'leap', 'into', 'electronic', 'typesetting', 'remaining', 'essentially', 'unchanged.', 'It', 'was', 'popularised', 'in', 'the', '1960s', 'with', 'the', 'release', 'of', 'Letraset', 'sheets', 'containing', 'Lorem', 'Ipsum', 'passages', 'and', 'more', 'recently', 'with', 'desktop', 'publishing', 'software', 'like', 'Aldus', 'PageMaker', 'including', 'versions', 'of', 'Lorem', 'Ipsum.', 'Why', 'do', 'we', 'use', 'it?', 'It', 'is', 'a', 'long', 'established', 'fact', 'that', 'a', 'reader', 'will', 'be', 'distracted', 'by', 'the', 'readable', 'content', 'of', 'a', 'page', 'when', 'looking', 'at', 'its', 'layout.', 'The', 'point', 'of', 'using', 'Lorem', 'Ipsum', 'is', 'that', 'it', 'has', 'a', 'more-or-less', 'normal', 'distribution', 'of', 'letters', 'as', 'opposed', 'to', 'using', 'Content', 'here', 'content', 'here', 'making', 'it', 'look', 'like', 'readable', 'English.', 'Many', 'desktop', 'publishing', 'packages', 'and', 'web', 'page', 'editors', 'now', 'use', 'Lorem', 'Ipsum', 'as', 'their', 'default', 'model', 'text', 'and', 'a', 'search', 'for', 'lorem', 'ipsum', 'will', 'uncover', 'many', 'web', 'sites', 'still', 'in', 'their', 'infancy.', 'Various', 'versions', 'have', 'evolved', 'over', 'the', 'years', 'sometimes', 'by', 'accident', 'sometimes', 'on', 'purpose', '(injected', 'humour', 'and', 'the', 'like).'],
      fundingStatement: 'ttttttttttttttttttttttttttttttttttttttttttttt',
      coiDeclaration: 'tttttttttttttttttt',
      copyrightLicence: randomCopyrightLicence,
      carriedOut: false,
    };

    // Insert the publication in DB and grab the data (including ID)
    const insertedPublication = await db.collection('publications')
      .insertOne(publicationExample)
      .then((doc) => {
        console.log(`Successfully inserted publication with id ${doc.ops[0]._id}`);
        return doc.ops[0];
      })
      .catch((err) => console.error('ERROR while inserting Publication: \n', err));

    // Aggregate 5 publications and generate the related publications
    const randomRelatedPublications = await db.collection('publications')
      .aggregate([{ $sample: { size: 5 } }])
      .toArray()
      .then((publications) => {
        const relatedPublications = [];

        // Compose RelatedPublications Object
        publications.forEach((publication) => {
          relatedPublications.push({
            publicationID: insertedPublication._id.toString(),
            relatedTo: publication._id.toString(),
            createdByUser: '0000-0000-0000-0000',
            ratings: [],
            dateCreated: new Date(),
          });
        });

        return relatedPublications;
      })
      .catch((err) => console.error('ERROR while aggregating publications for Random Related Publications: \n', err));

    // Insert Related Publications in DB
    await db.collection('relatedPublications')
      .insertMany(randomRelatedPublications)
      .then((doc) => console.log(`Successfully inserted related publications for ${insertedPublication._id}`))
      .catch((err) => console.error(`ERROR while inserting related publications for ${insertedPublication._id}: \n`, err));
  }

  console.log('--------------------------------');
  console.log('Finished populating the database');
  console.log('--------------------------------');

  client.close();
});

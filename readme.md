# Octopus API

This is the new API powering Octopus.

## Getting started

1. Clone this repository

```
git clone https://github.com/ScienceOctopus/octopus-api.git
cd octopus-api
```

2. Install dependencies

```
npm install
```

3. Insert example data

```
npm run migrate
```

4. Start the API

```
npm start
```


## .env file

The `.env` file is currently optional.

The application will default to using local MongoDB with `octopus` database.

You can copy-paste the below example which will enable logging and
use the default values.

```
# DEBUG variable is used to control logging levels
DEBUG=octopus:api:* -octopus:api:trace

# Restating defaults here
MONGO_URL=mongodb://localhost:27017
MONGO_DBNAME=octopus
BYPASS_AUTH=false
```

## TODOs

- correctly log all errors
- add support for file uploads to S3
- text extraction from uploaded files
- add support for sorting and filtering results
- implement email notifications (added as a collaborator, new linked publication)
- fill in missing pieces of documentation (JSDoc, apidocs)
- add cache layer

FROM node:12-alpine

COPY . /app
WORKDIR /app
RUN npm install --production

CMD npm run migrate & npm run migrate:covid & node main.js

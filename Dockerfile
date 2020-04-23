FROM node:12-alpine

COPY . /app
WORKDIR /app
RUN npm install --production
RUN npm run migrate

CMD node main.js

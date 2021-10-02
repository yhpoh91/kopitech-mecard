 # syntax=docker/dockerfile:1
 FROM node:12.16.1
 WORKDIR /app
 COPY . .
 RUN npm install
 CMD npm run migrate ; npm start
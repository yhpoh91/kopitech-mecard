require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');

Promise = require('bluebird');

const exceptionHandler = require('./services/exceptionHandler');
const globalRouter = require('./router');
const { L } = require('kopitech-logger')('App');

const port = process.env.PORT || 8080;
const requestMaxSize = '150mb';

const app = express();

app.set('trust proxy', true);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: requestMaxSize }));
app.use(bodyParser.json({ limit: requestMaxSize }));

app.use(globalRouter);
app.use(exceptionHandler.handleNotFound);
app.use(exceptionHandler.handleException);


// Create Application HTTP Server
const httpServer = http.createServer(app);
httpServer.listen(port, () => {
  L.info(`Server running on port ${port}`);
});

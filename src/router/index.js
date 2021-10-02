const express = require('express');

const exampleRouter = require('./example');

const { L } = require('kopitech-logger')('Global Router');

const router = express.Router({ mergeParams: true });

router.get('/', (_, res) => res.send('Server is online'));
router.use('/examples', exampleRouter);


module.exports = router;

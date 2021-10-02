const { L } = require('kopitech-logger')('Example Router');

const doSomething = async (req, res, next) => {
  try {
    res.status(200).send('You have reached the example route')
  } catch (error) {
    next(error);
  }
};

module.exports = {
  doSomething,
};

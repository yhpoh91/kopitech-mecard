const { L } = require('kopitech-logger')('Exception Handler');

function ExampleException(message) {
  this.name = 'ExampleException';
  this.message = message;
  this.stack = (new Error()).stack;

  this.isBusinessLogicException = true;
  this.statusMessage = 'Example Message';
  this.status = 500;
}
global.ExampleException = ExampleException;


const handleNotFound = async (req, res, next) => {
  try {
    const questionMarkIndex = req.originalUrl.indexOf('?');
    const hasQuery = questionMarkIndex >= 0;
    const route = hasQuery ? req.originalUrl.slice(0, questionMarkIndex) : req.originalUrl;

    const name = 'ResourceNotFound';
    L.error(`[${name}] - ${route}`);
    res.status(404).json({ 
      name,
      message: 'The resource does not exist'
    });
  } catch (error) {
    L.error(error);
    res.status(500).end();
  }
}

const handleException = async (error, req, res, next) => {
  try {
    L.error(error.message);
    if (error.isBusinessLogicException) {
      res.status(error.status).json({
        name: error.name,
        message: error.statusMessage,
        errors: error.errors,
      });
      return;
    }

    if (error.status) {
      res.status(error.status).json({
        name: error.name,
        message: error.message,
        errors: error.errors,
      });
      return;
    }

    L.error(error);
    res.status(500).end();
  } catch (error) {
    L.error(error);
    res.status(500).end();
  }
};

module.exports = {
  handleNotFound,
  handleException,
}
/**
 * Middlewares module
 * @module middlewares
 */

const morgan = require('morgan');
const bodyParser = require('body-parser');

/**
 * Applies middlewares
 * @param {object} app Express instance
 */
module.exports = ({app}) => {
  // Logger
  if (app.get('env') !== 'development') {
    app.use(morgan('dev'));
  }

  app.use(bodyParser.json());
}
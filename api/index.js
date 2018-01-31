/**
 * API module
 * @module api
 */

const config = require('config'); 
const router = require('express').Router;

const candies = require('./candies');
const stats = require('./stats');

/**
 * Root API endpoint
 * @param {object} app Express instance
 */
module.exports = ({app}) => {
  let api = router();

  api.use('/candies', candies());
  api.use('/stats', stats());

  /**
   * @api {get} / Return version number
   * @apiVersion 0.1
   * @apiName GetVersion
   * @apiGroup Root
   */
  api.get('/', (req, res) => {
    const version = config.get('version');
		res.json({ version });
	});

  app.use(api);
}
/**
 * Stats API module
 * @module api/stats
 */

const config = require('config'); 
const router = require('express').Router;

const db = require('../helpers').db;
const currency = require('../helpers').currency;
const { InvalidRequestError } = require('../exceptions')

/**
 * Stats API endpoint
 * @returns {object} Router
 */
module.exports = () => {
  let api = router();

  /**
   * @api {get} /stats/cost Cumulative cost of candies
   * @apiVersion 0.1.0
   * @apiName GetCost
   * @apiGroup Stats
   */
  api.get('/cost', async (req, res, next) => {
    let { cost } = await db.first('stats/cost');

    // Currency conversion
    if (req.query.currency) {
      const multiplier = await currency.get(req);
      cost = + (cost * multiplier).toFixed(2);
    }

    res.json({ cost });
  });

  /**
   * @api {get} /stats/cost/:id Get candy's cost
   * @apiVersion 0.1.0
   * @apiName GetCandyCost
   * @apiGroup Stats
   */
  api.get('/cost/:id', async (req, res, next) => {
    // Validation
    const id = parseInt(req.params.id, 10)

    if (isNaN(id)) {
      const error = InvalidRequestError(`Invalid parameter supplied for id`);
      next(error);
      return
    }

    const data = await db.first('stats/item/cost', id);
    if (data == null) {
      const error = InvalidRequestError(`Candy with id ${req.params.id} doesn't exist`);
      next(error);
      return
    }

    let { cost } = data;

    // Currency conversion
    if (req.query.currency) {
      const multiplier = await currency.get(req);
      cost = + (cost * multiplier).toFixed(2);
    }

    res.json({ cost });
  });

  /**
   * @api {get} /stats/price Cumulative price of candies
   * @apiVersion 0.1.0
   * @apiName GetPrice
   * @apiGroup Stats
   */
  api.get('/price', async (req, res, next) => {
    let { price } = await db.first('stats/price');

    // Currency conversion
    if (req.query.currency) {
      const multiplier = await currency.get(req);
      price = + (price * multiplier).toFixed(2);
    }

    res.json({ price });
  });

  /**
   * @api {get} /stats/cost/:id Get candy's price
   * @apiVersion 0.1.0
   * @apiName GetCandyPrice
   * @apiGroup Stats
   */
  api.get('/price/:id', async (req, res, next) => {
    // Validation
    const id = parseInt(req.params.id, 10)

    if (isNaN(id)) {
      const error = InvalidRequestError(`Invalid parameter supplied for id`);
      next(error);
      return
    }

    const data = await db.first('stats/item/price', id);
    if (data == null) {
      const error = InvalidRequestError(`Candy with id ${req.params.id} doesn't exist`);
      next(error);
      return
    }

    let { price } = data;

    // Currency conversion
    if (req.query.currency) {
      const multiplier = await currency.get(req);
      price = + (price * multiplier).toFixed(2);
    }

    res.json({ price });
  });

  return api;
}
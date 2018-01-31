/**
 * Candies API module
 * @module api/candies
 */

const config = require('config'); 
const router = require('express').Router;

const db = require('../helpers').db;
const currency = require('../helpers').currency;
const { InvalidRequestError } = require('../exceptions')

/**
 * Candies API endpoint
 * @returns {object} Router
 */
module.exports = () => {
  let api = router();

  /**
   * @api {get} /candies Get list of candies
   * @apiVersion 0.1.0
   * @apiName GetCandies
   * @apiGroup Candy
   */
  api.get('/', async (req, res, next) => {
    const candies = (await db.run('candies/list')).rows;

    // Currency conversion
    if (req.query.currency) {
      // Errors already contain normalized messages
      const multiplier = await currency.get(req);

      // pass by reference, no return
      candies.map(candy => {
        candy.cost = + (candy.cost * multiplier).toFixed(2);
        candy.price = + (candy.price * multiplier).toFixed(2);
      });
    }

    res.json({ candies });
  });

  /**
   * @api {post} /candies Add new candy
   * @apiVersion 0.1.0
   * @apiName AddCandy
   * @apiGroup Candy
   */
  api.post('/', async (req, res, next) => {
    let { description, cost, price, stock } = req.body;
    
    // Basic validation
    cost = parseFloat(cost);
    price = parseFloat(price);
    stock = parseInt(stock);

    if ( !description || isNaN(cost) || isNaN(price) || isNaN(stock) ||
      cost <= 0 || price <= 0 || stock <= 0) {
      const error = InvalidRequestError(`Invalid parameters supplied`);
      next(error);
      return
    }

    // In case if anything goes wrong, it'll throw error
    try {
      await db.run('candies/add', description, cost, price, stock);
      res.json({
        created: true
      });
    } catch(error) {
      // DB insert error, we can't do anything but to throw InternalError
      error.message = "Internal error";
      next(error);
    }
  });
  
  /**
   * @api {get} /candies/:id Get information about candy
   * @apiVersion 0.1.0
   * @apiName GetCandy
   * @apiGroup Candy
   */
  api.get('/:id', async (req, res, next) => {
    // Validation
    const id = parseInt(req.params.id, 10)

    if (isNaN(id)) {
      const error = InvalidRequestError(`Invalid parameter supplied for id`);
      next(error);
      return
    }

    const candy = await db.first('candies/get', req.params.id);
    if (candy == null) {
      const error = InvalidRequestError(`Candy with id ${req.params.id} doesn't exist`);
      next(error);
      return;
    } 
    
    if (req.query.currency) {
      // Errors already contain normalized messages
      const multiplier = await currency.get(req);

      candy.cost = + (candy.cost * multiplier).toFixed(2);
      candy.price = + (candy.price * multiplier).toFixed(2);
    }
    res.json({ ...candy });
  });
  
  /**
   * @api {put} /candies/:id Update candy
   * @apiVersion 0.1.0
   * @apiName UpdateCandy
   * @apiGroup Candy
   */
  api.put('/:id', async (req, res, next) => {
		// Validation
    const id = parseInt(req.params.id, 10)
    let { description, cost, price, stock } = req.body;

    if (isNaN(id)) {
      const error = InvalidRequestError(`Invalid parameter supplied for id`);
      next(error);
      return
    }

    cost = parseFloat(cost);
    price = parseFloat(price);
    stock = parseInt(stock);

    if ( !description || isNaN(cost) || isNaN(price) || isNaN(stock) ||
      cost <= 0 || price <= 0 || stock <= 0) {
      const error = InvalidRequestError(`Invalid parameters supplied`);
      next(error);
      return
    }

    // In case if anything goes wrong, it'll throw error
    try {
      const data = await db.run('candies/update', id, description, cost, price, stock);
      if (data.rowCount == 0) {
        // Not updated, candy with specified id doesn't exist
        const error = InvalidRequestError(`Candy with id ${req.params.id} doesn't exist`);
        next(error);
        return
      }

      res.json({
        updated: true
      });
    } catch(error) {
      // DB insert error, we can't do anything but to throw InternalError
      error.message = "Internal error";
      next(error);
    }
  });
  
  /**
   * @api {delete} /candies/:id Remove candy
   * @apiVersion 0.1.0
   * @apiName RemoveCandies
   * @apiGroup Candy
   */
  api.delete('/:id', async (req, res, next) => {
    // Validation
    const id = parseInt(req.params.id, 10)

    if (isNaN(id)) {
      const error = InvalidRequestError(`Invalid parameter supplied for id`);
      next(error);
      return
    }

    const op = await db.run('candies/remove', id);

    // Delete requests are idempotent by definition
    // hence, we can always safely return true
    res.json({
      deleted: true
    });
  });

  return api;
}
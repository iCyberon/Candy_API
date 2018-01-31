/**
 * Currency conversion helper module
 * @module helpers/currency
 */

const request = require('request');
const config = require('config');
const debug = require('debug')('Candy:API:helpers');

const currencyAPIKey = config.get('currencyLayer').key;
const currencyAPIURL = `http://apilayer.net/api/live?access_key=${currencyAPIKey}&currencies=`;

module.exports = {
  /**
   * Returns the multiplier rate for specified currency
   * @param {object} req Express.js request object
   */
  get(req) {
    const currency = req.query.currency;
    
    return new Promise((resolve, reject) => {
      request.get(currencyAPIURL+currency, (error, response, body) => {
        if (error) {
          error.message = `Invalid parameter supplied for currency`;
          error.status = 400;
          reject(error);
        } else {
          // currencylayer always returns 200 status code
          let json = JSON.parse(body);
          if (!json.success) {
            const error = new Error(`Internal API error`);
            error.status = 400;

            if (json.error.code == 202) // wrong currency code
              error.message = `Invalid parameter supplied for currency`;

            reject(error);
          } else {
            // weird API
            multiplier = json.quotes[`USD${currency}`];
            resolve(multiplier);
          }
        }
      });
    });
  }

}
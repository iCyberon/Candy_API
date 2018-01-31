var config = require('config');
var pgPool = require('pg').Pool;
var util = require('util');
var pool = new pgPool(config.get('postgres'));

pool.on('error', (err, client) => {
  console.error('idle client error', err.message, err.stack);
});

pool.on('connect', client => {

});

pool.on('acquire', client => {

});

module.exports.query = (query, ...values) => {
  return new Promise((resolve, reject) => {
    pool.query(query, values) 
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  })
}

module.exports.first = (query, ...values) => {
  return new Promise((resolve, reject) => {
    pool.query(query, values) 
      .then((data) => {
        if (data && util.isArray(data.rows) && data.rows.length >= 1)
          resolve(data.rows[0]);
        else
          resolve(null);
      })
      .catch((err) => {
        reject(err);
      });
  })
}

module.exports.client = () => {
    return pool.connect();
}
const express = require('express');
const path    = require('path');

const helpers     = require('./helpers');
const middlewares = require('./middlewares')
const api         = require('./api')

const app = express();

// setup
helpers.db.setup(path.join(__dirname, 'sql'));

// express async routes error handling
require('express-async-errors');

// configure
app.set('port', helpers.server.helpers);
app.disable('x-powered-by');
app.disable('graceful-exit');

// middlewares
middlewares({ app });
api({ app });

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  err.type = "invalid_request_error"
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      "type": err.type || "api_error",
      "message": err.message
    }
  });
});

module.exports = app;
/**
 * Server helper module
 * @module helpers/server
 */

const debug = require('debug')('Candy:API:helpers');

module.exports = {
  /**
   * Normalize a port into a number, string, or false
   * @return {(number|string|boolean)} The normalized port.
   */
  get port() {
    const value = process.env.PORT || '3000';
    const port = parseInt(value, 10);

    if (isNaN(port))
      return value;

    if (port >= 0)
      return port;

    return false;
  },

  /**
   * Event listener for HTTP server "error" event
   * @param {error} error The normalized port
   * @throws Will throw an error if the reason is unknown
   */
  onError(error) {
    if (error.syscall !== `listen`) {
      throw error;
    }
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(`Requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`Port is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  },

  /**
   * Event listener for HTTP server "listening" event
   */
  onListening() {
    debug(`Server listening...`);
  },

  /**
   * Exit handler for gracefully shutting down the server
   * @param {Express} app Express instance
   * @param {Server} server Underlying HTTP server
   * @param {error} [error] Optional error
   */
  onExit(app, server, error) {
    if (app.enabled('graceful-exit'))
      return;

    // Let everything know that we wish to exit gracefully
    app.enable('graceful-exit');

    if (error)
      console.error(error);

    console.log("Close server");
    // Stop accepting new connections
    server.close(async () => {
      // Terminate process
      debug(`Server shut down gracefully...`);
      process.exit(0);
    });
  }
}
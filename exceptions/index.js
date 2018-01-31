/**
 * Exceptions module
 * @module exceptions
 */

module.exports = {

  /**
   * Returns Error instance with specified message and 400 status code
   * @param {string} message Message to describe the error
   * @returns {object} The error object
   */
  InvalidRequestError: (message) => {
    const error = new Error(message);
    error.type = `invalid_request_error`;
    error.status = 400;

    return error;
  }
}
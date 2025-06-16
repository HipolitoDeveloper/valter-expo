export default class HttpError extends Error {
  constructor(statusCode, message) {
    super('The request returned with an error status code');
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.message = message;
  }
}

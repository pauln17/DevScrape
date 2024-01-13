const loggers = require("./loggers");

const requestLogger = (request, response, next) => {
  loggers.info("Method:", request.method);
  loggers.info("Path:  ", request.path);
  loggers.info("Body:  ", request.body);
  loggers.info("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

module.exports = {
  requestLogger,
  unknownEndpoint,
};

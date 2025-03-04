import EErrors from "../services/errors/enum.js";

const errorHandler = (error, req, res, next) => {
  let errorResponse = {
    status: "error",
    error: error.name || "UnknownError",
    message: error.message || "An unexpected error occurred.",
    cause: error.cause || "No additional details available.",
  };

  switch (error.code) {
    case EErrors.PATH_ERROR:
    case EErrors.INVALID_TYPE:
    case EErrors.DB_ERROR:
    case EErrors.INVALID_OPERATION:
      res.status(400).send(errorResponse);
      break;
    case EErrors.NOT_FOUND:
      res.status(404).send(errorResponse);
      break;
    default:
      res.status(500).send(errorResponse);
      break;
  }
};

export default errorHandler;

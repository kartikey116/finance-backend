import { ApiError } from "../utils/apiResponse.js";
import { env } from "../config/env.js";

export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map((val) => val.message).join(", ");
      error = new ApiError(400, message);
    } else if (error.code === 11000) { 
      error = new ApiError(400, "Duplicate field value entered");
    } else if (error.name === "CastError") {
      error = new ApiError(400, `Resource not found. Invalid: ${error.path}`);
    } else {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal Server Error";
      error = new ApiError(statusCode, message);
    }
  }

  const response = {
    success: false,
    message: error.message,
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  };

  res.status(error.statusCode || 500).json(response);
};

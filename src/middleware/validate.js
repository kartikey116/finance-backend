import { ApiError } from "../utils/apiResponse.js";

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    let message = err.message;
    if (err.errors && Array.isArray(err.errors)) {
      message = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
    }
    next(new ApiError(400, message));
  }
};

import type { Request, Response, NextFunction } from "express";
import ApiError from "./src/lib/ApiError";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new ApiError(404, `Route ${req.originalUrl} not found`, [
    `Method: ${req.method}`,
    `URL: ${req.originalUrl}`,
  ]);
  next(error);
};

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`Error: ${err.message}`);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      data: null,
      message: err.message,
      errors: err.errors,
    });
  }

  return res.status(500).json({
    success: false,
    data: null,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
    errors: [],
  });
};

export default errorHandler;

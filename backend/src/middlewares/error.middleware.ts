import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  keyPattern?: Record<string, any>;
  path?: string;
}

export const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message ||= "Internal Server Error";
  err.statusCode ||= 500;

  if (err.code === 11000) {
    const error = Object.keys(err.keyPattern || {}).join(",");
    err.message = `Duplicate field - ${error}`;
    err.statusCode = 400;
  }

  if (err.name === "CastError") {
    const errorPath = err.path;
    err.message = `Invalid Format of ${errorPath}`;
    err.statusCode = 400;
  }

  const response = {
    success: false,
    message: err.message,
    error: err,
  };

  return res.status(err.statusCode).json(response);
};

type ControllerFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const TryCatch =
  (passedFunc: ControllerFunction) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await passedFunc(req, res, next);
    } catch (error) {
      next(error);
    }
  };

import { Response } from 'express';

interface SuccessResponseOptions<T> {
  res: Response;
  message?: string;
  data?: T;
  statusCode?: number;
}

interface ErrorResponseOptions {
  res: Response;
  message?: string;
  error?: any;
  statusCode?: number;
}

export class ApiResponse {
  static success<T>({
    res,
    message = 'Success',
    data,
    statusCode = 200,
  }: SuccessResponseOptions<T>) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error({
    res,
    message = 'An error occurred',
    error,
    statusCode = 500,
  }: ErrorResponseOptions) {
    return res.status(statusCode).json({
      success: false,
      message,
      error,
    });
  }
}
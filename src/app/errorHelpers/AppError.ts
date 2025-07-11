// custom error class

class AppError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string, stack: "") {
    super(message); // throw new Error("Something Went Wrong")
    this.statusCode = statusCode;

    if (stack) {
      this.stack = stack;
    } else {
      // default Error part
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;

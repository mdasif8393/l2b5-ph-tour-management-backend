/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

const catchAsync =
  // fn = async (req: Request, res: Response, next: NextFunction) => {full code}
  (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
    // Promise.resolve = try{}
    Promise.resolve(fn(req, res, next)).catch((err: any) => {
      next(err);
    });
  };

export default catchAsync;

import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

// validation zod schema
const validateRequest =
  (zodSchema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await zodSchema.parseAsync(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };

export default validateRequest;

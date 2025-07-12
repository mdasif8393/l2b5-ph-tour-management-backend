import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";

// check user has permission or not to access specific routes

const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(httpStatus.NOT_FOUND, "No token receive");
      }

      const verifiedToken = verifyToken(
        accessToken as string,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      console.log(verifiedToken.role);

      // authRoles = ["ADMIN", "SUPER_ADMIN"].includes("ADMIN")
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(
          httpStatus.NOT_ACCEPTABLE,
          "Your are not permitted to access this route"
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };

export default checkAuth;

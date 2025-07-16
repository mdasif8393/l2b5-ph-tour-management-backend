/* eslint-disable no-console */
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";

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

      const isUserExists = await User.findOne({
        email: verifiedToken.email,
      });

      // if user exists in database then show error
      if (!isUserExists) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exists");
      }

      if (isUserExists.isActive === IsActive.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, "User inActive");
      }

      if (isUserExists.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
      }

      // authRoles = ["ADMIN", "SUPER_ADMIN"].includes("ADMIN")
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(
          httpStatus.NOT_ACCEPTABLE,
          "Your are not permitted to access this route"
        );
      }

      req.user = verifiedToken;
      next();
    } catch (err) {
      next(err);
    }
  };

export default checkAuth;

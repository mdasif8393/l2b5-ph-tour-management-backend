import httpStatus from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";

import validateRequest from "../../middlewares/validateRequest";
import AppError from "../../errorHelpers/AppError";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);

router.get(
  "/all-users",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(httpStatus.NOT_FOUND, "No token receive");
      }

      const verifyToken = jwt.verify(accessToken as string, "secret");

      console.log(verifyToken);
      if ((verifyToken as JwtPayload).role !== Role.ADMIN) {
        throw new AppError(
          httpStatus.NOT_ACCEPTABLE,
          "Your are not permitted to access this route"
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  },
  UserControllers.getAllUsers
);

export const UserRoutes = router;

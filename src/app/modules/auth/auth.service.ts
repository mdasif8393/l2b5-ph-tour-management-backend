import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExists = await User.findOne({ email });

  // if user exists in database then show error
  if (!isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exists");
  }

  // if password match
  const isPasswordMatched = await bcrypt.compare(
    password as string,
    isUserExists.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect password");
  }

  const jwtPayload = {
    userId: isUserExists._id,
    email: isUserExists.email,
    role: isUserExists.role,
  };

  const accessToken = jwt.sign(jwtPayload, "secret", {
    expiresIn: "1d",
  });

  return {
    accessToken,
  };
};

export const AuthServices = {
  credentialsLogin,
};

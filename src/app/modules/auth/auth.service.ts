import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";

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

  return {
    email: isUserExists.email,
  };
};

export const AuthServices = {
  credentialsLogin,
};

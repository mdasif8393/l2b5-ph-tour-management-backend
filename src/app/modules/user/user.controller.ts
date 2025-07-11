/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    res.status(httpStatus.CREATED).json({
      message: "User Created Successfully",
      user,
    });
  }
);

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  // old way to handle try catch
  try {
    const result = await UserServices.getAllUsers();

    //// old way to send response
    // res.status(httpStatus.OK).json({
    //   success: true,
    //   message: "Users retrieved successfully",
    //   data: users,
    // });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Users retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (err: any) {
    next(err);
  }
};

export const UserControllers = {
  createUser,
  getAllUsers,
};

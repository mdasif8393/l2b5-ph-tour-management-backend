import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { PaymentService } from "./payment.service";
import { envVars } from "../../config/env";

const successPayment = catchAsync(async (req: Request, res: Response) => {});
const failPayment = catchAsync(async (req: Request, res: Response) => {});
const cancelPayment = catchAsync(async (req: Request, res: Response) => {});

export const PaymentController = {
  successPayment,
  failPayment,
  cancelPayment,
};

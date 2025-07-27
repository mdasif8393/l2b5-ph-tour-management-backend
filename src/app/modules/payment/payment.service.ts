/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";

const successPayment = async (query: Record<string, string>) => {
  // update booking status to confirm
  // update payment status to paid

  const session = await Booking.startSession();
  session.startTransaction();
  try {
    // update payment status paid
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.PAID,
      },
      { runValidators: true, session }
    );

    // update booking status
    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      {
        status: BOOKING_STATUS.COMPLETE,
      },
      { runValidators: true, session: session }
    );

    await session.commitTransaction();
    session.endSession();
    return { success: true, message: "Payment completed successfully" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const failPayment = async (query: Record<string, string>) => {
  // update booking status to fail
  // update payment status to fail
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    // update payment status paid
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.FAILED,
      },
      { runValidators: true, session }
    );

    // update booking status
    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      {
        status: BOOKING_STATUS.FAILED,
      },
      { runValidators: true, session: session }
    );

    await session.commitTransaction();
    session.endSession();
    return { success: false, message: "Payment failed" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const cancelPayment = async (query: Record<string, string>) => {
  // Update Booking Status to CANCEL
  // Update Payment Status to CANCEL

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.CANCELLED,
      },
      { runValidators: true, session: session }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.CANCEL },
      { runValidators: true, session }
    );

    await session.commitTransaction(); //transaction
    session.endSession();
    return { success: false, message: "Payment Cancelled" };
  } catch (error) {
    await session.abortTransaction(); // rollback
    session.endSession();
    // throw new AppError(httpStatus.BAD_REQUEST, error) ❌❌
    throw error;
  }
};

// payment later
const initPayment = async (bookingId: string) => {
  // Find if booking id is available or not in Payment database
  const payment = await Payment.findOne({ booking: bookingId });

  if (!payment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Payment not found. You have not booked this tour"
    );
  }

  // find Booking
  const booking = await Booking.findById(payment.booking)
    .populate("user", "name email  phone address")
    .populate("tour", "title costFrom ")
    .populate("payment");

  // send data to ssl commerz
  const userAddress = (booking?.user as any).address;
  const userEmail = (booking?.user as any).email;
  const userPhoneNumber = (booking?.user as any).phone;
  const userName = (booking?.user as any).name;

  const sslPayload: ISSLCommerz = {
    address: userAddress,
    email: userEmail,
    phoneNumber: userPhoneNumber,
    name: userName,
    amount: Number(payment.amount),
    transactionId: payment.transactionId,
  };

  // make payment url
  const sslPayment = await SSLService.sslPaymentInit(sslPayload);

  return {
    paymentUrl: sslPayment.GatewayPageURL,
  };
};

export const PaymentService = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
};

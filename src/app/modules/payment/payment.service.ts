import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";

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
      { new: true, runValidators: true, session }
    );

    // update booking status
    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      {
        status: BOOKING_STATUS.COMPLETE,
      },
      { new: true, runValidators: true, session: session }
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

const failPayment = () => {
  // update booking status to fail
  // update payment status to fail
};

const cancelPayment = () => {
  // update booking status to cancel
  // update payment status to cancel
};

export const PaymentService = {
  successPayment,
  failPayment,
  cancelPayment,
};

const successPayment = async (query: Record<string, string>) => {};

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

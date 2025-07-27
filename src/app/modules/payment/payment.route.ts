import express from "express";
import { PaymentController } from "./payment.controller";

const router = express.Router();

router.post("/success", PaymentController.successPayment);
router.post("/fail", PaymentController.failPayment);
router.post("/cancel", PaymentController.cancelPayment);
router.post("/init-payment/:bookingId", PaymentController.initPayment);

export const PaymentRoutes = router;

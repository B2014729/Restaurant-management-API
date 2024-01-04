import express from "express";

import * as PaymentController from '../Controllers/PaymentController.js';
const router = express.Router();

const PaymentRouter = (app) => {
    router.route("/list")
        .get(PaymentController.GetPaymentList);
    router.route("/:id")
        .get(PaymentController.GetPayment)
        .put(PaymentController.UpdatePayment)
        .delete(PaymentController.DeletePayment);
    router.route("/create")
        .post(PaymentController.NewPayment);

    return app.use("/api/v1/restaurant-management-system/payment", router);
}

export default PaymentRouter;
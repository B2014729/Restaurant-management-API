import express from "express";

import * as BillController from "../Controllers/BillController.js";
const router = express.Router();

const BillWebRouter = (app) => {
    router.route("/list")
        .get(BillController.GetBillList);
    router.route("/statistical/:year")
        .get(BillController.StatisticalBillWithMonth);
    router.route("/statistical-in-month/:month&:year")
        .get(BillController.StatisticalBillWithMonthAndYear);
    router.route("/list/:start&:end")
        .get(BillController.GetBillListWhereTime);
    router.route("/:id")
        .get(BillController.GetBill);

    router.route("/table/:idtable")
        .get(BillController.GetBillWithIdTable)
        .put(BillController.UpdateStatusBill)
    //   .delete(PaymentController.DeletePayment);
    router.route("/create")
        .post(BillController.NewBill);


    return app.use("/api/v1/restaurant-management-system/bill", router);
}

export default BillWebRouter;
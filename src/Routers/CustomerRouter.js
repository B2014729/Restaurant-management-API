import express from "express";

import * as CustomerController from '../Controllers/CustomerController.js';

const router = express.Router();

const CustomerWebRoute = (app) => {
    router.route("/list")
        .get(CustomerController.GetCustomerList);
    router.route("/evalues")
        .get(CustomerController.GetEvalues);
    router.route("/:id")
        .get(CustomerController.GetCustomer)
        .put(CustomerController.UpdateCustomer)
        .delete(CustomerController.DeleteCustomer);
    router.route("/create")
        .post(CustomerController.NewCustomer);

    return app.use("/api/v1/restaurant-management-system/customer", router);
}

export default CustomerWebRoute;
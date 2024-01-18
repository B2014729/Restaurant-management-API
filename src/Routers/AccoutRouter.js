import express from "express";

import * as AccountController from '../Controllers/AccountController.js';

const router = express.Router();

const CustomerWebRoute = (app) => {
    // router.route("/list")
    //     .get(CustomerController.GetCustomerList);
    // router.route("/:id")
    //     .get(CustomerController.GetCustomer)
    //     .put(CustomerController.UpdateCustomer)
    //     .delete(CustomerController.DeleteCustomer);
    // router.route("/create")
    //     .post(CustomerController.NewCustomer);

    router.route("/login")
        .post(AccountController.Login);
    return app.use("/api/v1/restaurant-management-system/account", router);
}

export default CustomerWebRoute;
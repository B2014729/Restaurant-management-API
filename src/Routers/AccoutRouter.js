import express from "express";

import * as AccountController from '../Controllers/AccountController.js';

const router = express.Router();

const CustomerWebRoute = (app) => {

    router.route("/login")
        .post(AccountController.Login);
    // router.route("/customer-login")
    //     .post(AccountController.LoginCustomer);
    router.route("/customer-register")
        .post(AccountController.Register);


    return app.use("/api/v1/restaurant-management-system/account", router);
}

export default CustomerWebRoute;
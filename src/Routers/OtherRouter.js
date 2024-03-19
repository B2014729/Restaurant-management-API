import express from "express";

import * as AccountController from "../Controllers/AccountController.js";

const router = express.Router();

const OtherRouter = (app) => {
    //Route Account
    router.route("/account/:id").put(AccountController.UpdateAcountInfor);


    return app.use("/api/v1/restaurant-management-system", router);
}

export default OtherRouter;
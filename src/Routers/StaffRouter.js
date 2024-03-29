import express from "express";

import * as StaffController from "../Controllers/StaffController.js";

const router = express.Router();

const StaffWebRoute = (app) => {
    router.route("/list")
        .get(StaffController.GetStaffList);
    router.route("/token")
        .post(StaffController.GetStaffWithToken);
    router.route("/:id")
        .get(StaffController.GetStaff)
        .put(StaffController.UpdateStaff)
        .delete(StaffController.DeleteStaff);
    router.route("/create")
        .post(StaffController.NewStaff);
    router.route("/salary/:idPhase")
        .get(StaffController.SalaryTable);
    router.route("/salary/:id/calendrier/:idPhase")
        .get(StaffController.Salary);
    return app.use("/api/v1/restaurant-management-system/staff", router);
}

export default StaffWebRoute;
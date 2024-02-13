import express from "express";

import * as CalendriedWorkStaffController from '../Controllers/CalendriedWorkStaffController.js';
const router = express.Router();

const CalendriedWorkStaffRouter = (app) => {
    router.route("/phase")
        .get(CalendriedWorkStaffController.GetAllPhase);
    router.route("/")
        .post(CalendriedWorkStaffController.GetCalendriedWithPhase);
    // router.route("/:id")
    //     .get(BookingsController.GetBookings)
    //     .put(BookingsController.UpdateBookings)
    //     .delete(BookingsController.DeleteBookings);
    // router.route("/create")
    //     .post(BookingsController.NewBookings);

    return app.use("/api/v1/restaurant-management-system/calendried", router);
}

export default CalendriedWorkStaffRouter;
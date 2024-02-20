import express from "express";

import * as CalendriedWorkStaffController from '../Controllers/CalendriedWorkStaffController.js';
const router = express.Router();

const CalendriedWorkStaffRouter = (app) => {
    router.route("/phase")
        .get(CalendriedWorkStaffController.GetAllPhase);
    router.route("/phase/create")
        .post(CalendriedWorkStaffController.CreatePhase);
    router.route("/:idPhase")
        .get(CalendriedWorkStaffController.GetCalendrierWithPhase);
    router.route("/arrange/:idPhase")
        .get(CalendriedWorkStaffController.GetCalendrierArrangeWithPhase);
    router.route("/arrange/create")
        .post(CalendriedWorkStaffController.CreateCalendrierArrange);
    // router.route("/:id")
    //     .get(BookingsController.GetBookings)
    //     .put(BookingsController.UpdateBookings)
    //     .delete(BookingsController.DeleteBookings);
    // router.route("/create")
    //     .post(BookingsController.NewBookings);

    return app.use("/api/v1/restaurant-management-system/calendrier", router);
}

export default CalendriedWorkStaffRouter;
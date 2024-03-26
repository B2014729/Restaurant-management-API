import express from "express";

import * as BookingsController from "../Controllers/BookingsController.js";

const router = express.Router();

const BookingsWebRoute = (app) => {

    router.route("/list")
        .get(BookingsController.GetBookingsList);
    router.route("/list-with-customer/:token")
        .get(BookingsController.GetBookingsWithIdCustomer);
    router.route("/confirm/:id")
        .put(BookingsController.ConfirmBooking);
    router.route("/:id")
        .get(BookingsController.GetBookings)
        .put(BookingsController.UpdateBookings)
        .delete(BookingsController.DeleteBookings);
    router.route("/create")
        .post(BookingsController.NewBookings);

    return app.use("/api/v1/restaurant-management-system/bookings", router);
}

export default BookingsWebRoute;
import express from "express";

import * as DishController from '../Controllers/DishController.js';

const router = express.Router();

const DishWebRoute = (app) => {
    router.route("/list")
        .get(DishController.GetDishList);
    router.route("/:id")
        .get(DishController.GetDish)
        .put(DishController.UpdateDish)
        .delete(DishController.DeleteDish);
    router.route("/create")
        .post(DishController.NewDish);

    return app.use("/api/v1/restaurant-management-system/dish", router);
}

export default DishWebRoute;
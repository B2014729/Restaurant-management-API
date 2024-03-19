import express from "express";

import * as DepotController from '../Controllers/DepotController.js';

const router = express.Router();

const DepotWebRoute = (app) => {
    router.route("/list")
        .get(DepotController.GetDepot);
    router.route("/update")
        .put(DepotController.Update);
    router.route("/:id")
        .get(DepotController.GetGoodsInDepot)
        .delete(DepotController.DeleteGoodsInDepot);
    router.route("/create")
        .post(DepotController.AddGoodsInDepot);

    return app.use("/api/v1/restaurant-management-system/depot", router);
}

export default DepotWebRoute;
import express from "express";

import * as GoodsController from '../Controllers/GoodsController.js';

const router = express.Router();

const GoodsWebRoute = (app) => {
    router.route("/list")
        .get(GoodsController.GetGoodsList);
    router.route("/:id")
        .get(GoodsController.GetGoods)
        .put(GoodsController.UpdateGoods)
        .delete(GoodsController.DeleteGoods);
    router.route("/create")
        .post(GoodsController.NewGoods);

    return app.use("/api/v1/restaurant-management-system/goods", router);
}

export default GoodsWebRoute;
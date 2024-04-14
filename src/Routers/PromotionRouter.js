import express from "express";
import * as PromotionController from "../Controllers/PromotionController.js";

const router = express.Router();

const PromotionRoute = (app) => {

    router.route("/list")
        .get(PromotionController.GetPromotionList);
    router.route("/:id")
        .get(PromotionController.GetPromotion)
        .put(PromotionController.UpdatePromotion)
        .delete(PromotionController.DeletePromotion);
    router.route("/create")
        .post(PromotionController.NewPromotion);

    return app.use("/api/v1/restaurant-management-system/promotion", router);
}

export default PromotionRoute;
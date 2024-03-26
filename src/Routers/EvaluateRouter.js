import express from "express";

import * as EvaluateController from "../Controllers/EvaluateController.js";

const router = express.Router();

const EvaluateWebRouter = (app) => {

    router.route("/list")
        .get(EvaluateController.GetEvaluateList);
    router.route("/:id")
        .get(EvaluateController.GetEvaluate)
        .put(EvaluateController.UpdateEvaluate)
        .delete(EvaluateController.DeleteEvaluate);
    router.route("/create")
        .post(EvaluateController.NewEvaluate);

    return app.use("/api/v1/restaurant-management-system/evaluate", router);
}

export default EvaluateWebRouter;
import express from "express";

import * as DataSetController from '../Controllers/DataSetController.js';

const router = express.Router();

const DatasetRouter = (app) => {
    router.route("/list")
        .get(DataSetController.GetAll);
    router.route("/create")
        .post(DataSetController.CreateDataSet);

    return app.use("/api/v1/restaurant-management-system/dataset_revenue", router);
}

export default DatasetRouter;
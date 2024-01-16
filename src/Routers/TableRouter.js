import express from "express";

import * as TableController from "../Controllers/TableController.js";

const router = express.Router();

const TableWebRouter = (app) => {

    router.route("/list")
        .get(TableController.GetTableList);
    router.route("/:id")
        .get(TableController.GetTable)
        .put(TableController.UpdateTable)
        .delete(TableController.DeleteTable);
    router.route("/create")
        .post(TableController.NewTable);

    return app.use("/api/v1/restaurant-management-system/table", router);
}

export default TableWebRouter;
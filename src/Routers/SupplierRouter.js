import express from "express";

import * as SupplierController from "../Controllers/SupplierController.js";

const router = express.Router();

const SupplierWebRoute = (app) => {

    router.route("/list")
        .get(SupplierController.GetSupplierList);
    router.route("/:id")
        .get(SupplierController.GetSupplier)
        .put(SupplierController.UpdateSupplier)
        .delete(SupplierController.DeleteSupplier);
    router.route("/create")
        .post(SupplierController.NewSupplier);

    return app.use("/api/v1/restaurant-management-system/supplier", router);
}

export default SupplierWebRoute;
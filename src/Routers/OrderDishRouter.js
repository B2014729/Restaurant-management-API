import express from "express";

import * as OrderDishController from '../Controllers/OrderDishController.js';
const router = express.Router();

const OrderDishWebRouter = (app) => {
    router.route("/list")
        .get(OrderDishController.GetOrderDishList);
    router.route("/list/date/:date")
        .get(OrderDishController.GetListOrderInDateAndNoSendToKitchen);
    router.route("/list-dish-paid/date/:date")
        .get(OrderDishController.GetListDishPaidInDate);
    router.route("/update-send-to-kitchen/:id")
        .put(OrderDishController.SendOrderToKitchen);
    router.route("/dish-paid/:id")//id => iddatmon, body => idmon
        .put(OrderDishController.UpdateDishPaid);
    router.route("/:id")
        .get(OrderDishController.GetOrderDish)
        .delete(OrderDishController.DeleteOrderDish);
    router.route("/create")
        .post(OrderDishController.NewOrderDish);

    return app.use("/api/v1/restaurant-management-system/order-dish", router);
}

export default OrderDishWebRouter;
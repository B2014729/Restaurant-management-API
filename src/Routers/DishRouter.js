import express from "express";

import * as DishController from '../Controllers/DishController.js';
import multer from "multer";
import appRootPath from "app-root-path";


// Upload file image ------------------------------
const storage = multer.diskStorage({
    //Noi luu anh tren server
    destination: (req, file, cb) => {
        cb(null, appRootPath + '/src/public/images/');
    },
    //Set ten moi cho anh
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.png')
    }
});

const uploadFile = multer({ storage: storage });
const router = express.Router();

const DishWebRoute = (app) => {
    router.route("/list")
        .get(DishController.GetDishList);
    router.route("/list-on-type")
        .get(DishController.GetDishListOrderByType);
    router.route("/list-sell-a-lot")
        .get(DishController.GetDishSellALot);
    router.route("/statistical-dish-sell")
        .get(DishController.GetStatisticalDish);
    router.route("/menu")
        .get(DishController.GetMenuInfor);
    router.route("/menu/add")
        .post(DishController.AddDishOnMenu);

    router.route("/:id")
        .get(DishController.GetDish)
        .put(DishController.UpdateDish)
        .delete(DishController.DeleteDish);
    router.route("/create")
        .post(uploadFile.single('hinhanh'), DishController.NewDish);

    router.route("/menu/:id")
        .delete(DishController.DeleteOutMenu);

    return app.use("/api/v1/restaurant-management-system/dish", router);
}

export default DishWebRoute;
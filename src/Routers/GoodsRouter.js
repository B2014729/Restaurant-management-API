import express from "express";

import * as GoodsController from '../Controllers/GoodsController.js';
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

const GoodsWebRoute = (app) => {
    router.route("/list")
        .get(GoodsController.GetGoodsList);
    router.route("/:id")
        .get(GoodsController.GetGoods)
        .put(uploadFile.single('image'), GoodsController.UpdateGoods)
        .delete(GoodsController.DeleteGoods);
    router.route("/create")
        .post(uploadFile.single('image'), GoodsController.NewGoods);

    return app.use("/api/v1/restaurant-management-system/goods", router);
}

export default GoodsWebRoute;
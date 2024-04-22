import express from "express";
import * as PromotionController from "../Controllers/PromotionController.js";
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

const PromotionRoute = (app) => {

    router.route("/list")
        .get(PromotionController.GetPromotionList);
    router.route("/:id")
        .get(PromotionController.GetPromotion)
        .put(PromotionController.UpdatePromotion)
        .delete(PromotionController.DeletePromotion);
    router.route("/upload-banner/:id")
        .put(uploadFile.single('banner'), PromotionController.UploadBanner);
    router.route("/create")
        .post(uploadFile.single('banner'), PromotionController.NewPromotion);

    return app.use("/api/v1/restaurant-management-system/promotion", router);
}

export default PromotionRoute;
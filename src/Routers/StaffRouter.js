import express from "express";

import * as StaffController from "../Controllers/StaffController.js";
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

const StaffWebRoute = (app) => {

    router.route("/list")
        .get(StaffController.GetStaffList);
    router.route("/token")
        .post(StaffController.GetStaffWithToken);
    router.route("/:id")
        .get(StaffController.GetStaff)
        .put(StaffController.UpdateStaff)
        .delete(StaffController.DeleteStaff);
    router.route("/upload-avatar/:token")
        .post(uploadFile.single('avatar'), StaffController.UploadAvatar);
    router.route("/create")
        .post(StaffController.NewStaff);
    router.route("/salary/:idPhase")
        .get(StaffController.SalaryTable);
    router.route("/salary/:id/calendrier/:idPhase")
        .get(StaffController.Salary);
    return app.use("/api/v1/restaurant-management-system/staff", router);
}

export default StaffWebRoute;
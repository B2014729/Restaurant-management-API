import CustomerWebRoute from "./CustomerRouter.js";
import StaffWebRoute from "./StaffRouter.js";
import SupplierWebRoute from "./SupplierRouter.js";
import DishWebRoute from "./DishRouter.js";
import GoodsWebRoute from "./GoodsRouter.js";
import PaymentWebRouter from "./PaymentRouter.js";
import BookingWebRouter from "./BookingsRouter.js";
import TableWebRoute from "./TableRouter.js";

import OrderRouter from "./OrderRouter.js";


export default (app) => {
    StaffWebRoute(app);         //Route nhan vien
    CustomerWebRoute(app);      //Route khach hang
    SupplierWebRoute(app);      //Route nha cung cap hang hoa
    DishWebRoute(app);          //Route mon an
    GoodsWebRoute(app);         //Route hang hoa
    PaymentWebRouter(app);      //Route phieu chi
    BookingWebRouter(app);      //Route dat ban
    TableWebRoute(app);         //Route ban


    OrderRouter(app);
}
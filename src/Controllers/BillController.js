import BillService from "../Services/BillService.js";
import StaffService from "../Services/StaffService.js";
import OrderDishService from "../Services/OrderDishService.js";
import DishService from "../Services/DishService.js";
import TableService from "../Services/TableService.js";
import PromotionService from "../Services/PromotionService.js";
import * as JWT from "../Services/JWTService.js";

import FormatResponseJson from "../Services/FotmatResponse.js";

const GetBill = async (req, res) => {
    let id = req.params.id;
    if (!id) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    } else {
        id = Number(id);
        if (isNaN(id)) {
            return res.status(404).json(FormatResponseJson(404, "Id is not Number", []));
        }
    }
    try {
        let [bill, billDetail] = await BillService.FindOneById(id);
        if (!bill || bill.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found payment id ${id}`, []));
        }

        let resultStaff = await StaffService.FindOneById(bill[0].idnhanvien);

        let resultDetailOrder = [];
        let payment = 0;
        let discount = 0;

        for (let i = 0; i < billDetail.length; i++) {
            let [order, detailOrder] = await OrderDishService.FindOneById(billDetail[i].iddatmon);
            for (let index = 0; index < detailOrder.length; index++) {
                let element = detailOrder[index];
                let resultDetailBill = {};

                payment += element.gia * element.soluong;

                if (element.idmon != 100) {
                    let dishInfor = await DishService.FindOneById(element.idmon);
                    delete element.idmon;
                    element.mon = dishInfor[0];
                    //payment = payment + (element.soluong * dishInfor[0].gia);
                    element.khuyenmai = {};
                } else {
                    if (element.idcombo != 100) {
                        let Promotion = await PromotionService.FindOneById(element.idcombo);
                        if (Promotion.length <= 0) {
                            console.log(FormatResponseJson(400, `Not found Promotion id ${id}`, []));
                        } else {
                            let ListDish = Promotion[1];
                            let LishDishDetail = [];
                            let totalPayment = 0;
                            for (let index = 0; index < ListDish.length; index++) {
                                const element = ListDish[index];
                                let resultDish = await DishService.FindOneById(element.idmon);
                                if (resultDish && resultDish.length > 0) {
                                    resultDish[0].soluong = element.soluong;
                                    LishDishDetail.push(resultDish[0]);
                                    totalPayment += resultDish[0].soluong * resultDish[0].gia;
                                }
                            }

                            Promotion[0][0].giamgia = ((totalPayment * Promotion[0][0].giatrikhuyenmai) / 100)
                            Promotion[0][0].thanhtoan = totalPayment - Promotion[0][0].giamgia;

                            element.khuyenmai = Promotion[0][0];
                            element.mon = LishDishDetail;
                            //payment += (Promotion[0][0].thanhtoan * element.soluong);

                            discount += (element.soluong * Promotion[0][0].giamgia);
                        }
                    }
                }
                delete element.idcombo;
                delete element.idmon;
                resultDetailBill = element;
                resultDetailOrder.push(resultDetailBill);
            }
        }

        let resultBillInfo = [{
            idhoadon: bill[0].idhoadon,
            idban: bill[0].idban,
            nhanvienlap: resultStaff[0],
            tennhanvien: resultStaff[0].hoten,
            ngaygiotao: bill[0].ngaygiotao,
            ngaygioxuat: bill[0].ngaygioxuat,
            trangthai: bill[0].trangthai,
            chitietdatmon: resultDetailOrder,
            thanhtoan: payment,
            giamgia: discount,
        }];

        return res.status(200).json(FormatResponseJson(200, "Successful", resultBillInfo));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}

const GetBillEating = async (req, res) => {//List  bill => Danh  hoa don dang con  an chua thanh toan
    try {
        let listBill = await BillService.FindAllBillUnpaid();

        if (listBill.length === 0) {
            return res.status(400).json(FormatResponseJson(400, `Not list bill no payment`, []));
        }

        let resultBillList = [];
        for (let i = 0; i < listBill.length; i++) {
            const billItem = listBill[i];

            let [bill, billDetail] = await BillService.FindOneById(billItem.idhoadon);
            if (!bill || bill.length <= 0) {
                return res.status(400).json(FormatResponseJson(400, `Not found payment id ${id}`, []));
            }

            let resultStaff = await StaffService.FindOneById(bill[0].idnhanvien);

            let resultDetailOrder = [];
            let payment = 0;
            let discount = 0;

            for (let i = 0; i < billDetail.length; i++) {
                let [order, detailOrder] = await OrderDishService.FindOneById(billDetail[i].iddatmon);
                for (let index = 0; index < detailOrder.length; index++) {
                    let element = detailOrder[index];

                    payment += element.gia * element.soluong;

                    let resultDetailBill = {};
                    if (element.idmon != 100) {
                        let dishInfor = await DishService.FindOneById(element.idmon);
                        delete element.idmon;
                        element.mon = dishInfor[0];
                        //payment = payment + (element.soluong * dishInfor[0].gia);
                        element.khuyenmai = {};
                    } else {
                        if (element.idcombo != 100) {
                            let Promotion = await PromotionService.FindOneById(element.idcombo);
                            if (Promotion.length <= 0) {
                                console.log(FormatResponseJson(400, `Not found Promotion id ${id}`, []));
                            } else {
                                let ListDish = Promotion[1];
                                let LishDishDetail = [];
                                let totalPayment = 0;
                                for (let index = 0; index < ListDish.length; index++) {
                                    const element = ListDish[index];
                                    let resultDish = await DishService.FindOneById(element.idmon);
                                    if (resultDish && resultDish.length > 0) {
                                        resultDish[0].soluong = element.soluong;
                                        LishDishDetail.push(resultDish[0]);
                                        totalPayment += resultDish[0].soluong * resultDish[0].gia;
                                    }
                                }

                                Promotion[0][0].giamgia = ((totalPayment * Promotion[0][0].giatrikhuyenmai) / 100)
                                Promotion[0][0].thanhtoan = totalPayment - Promotion[0][0].giamgia;

                                element.khuyenmai = Promotion[0][0];
                                element.mon = LishDishDetail;

                                //payment += (Promotion[0][0].thanhtoan * element.soluong);

                                discount += (element.soluong * Promotion[0][0].giamgia);
                            }
                        }
                    }
                    delete element.idcombo;
                    delete element.idmon;
                    resultDetailBill = element;
                    resultDetailOrder.push(resultDetailBill);
                }
            }

            resultBillList.push({
                idhoadon: bill[0].idhoadon,
                idban: bill[0].idban,
                nhanvienlap: resultStaff[0],
                tennhanvien: resultStaff[0].hoten,
                ngaygiotao: bill[0].ngaygiotao,
                ngaygioxuat: bill[0].ngaygioxuat,
                trangthai: bill[0].trangthai,
                chitietdatmon: resultDetailOrder,
                thanhtoan: payment,
                giamgia: discount,
            });
        }

        return res.status(200).json(FormatResponseJson(200, "Successful", resultBillList));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}


const GetBillWithIdTable = async (req, res) => {// Lay thong tin cua ban dang an (=> chua thanh toan)
    let id = req.params.idtable;
    if (!id) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    } else {
        id = Number(id);
        if (isNaN(id)) {
            return res.status(404).json(FormatResponseJson(404, "Id is not Number", []));
        }
    }
    try {
        let billWithIdTable = await BillService.FindOneByIdTableNew(id);

        if (billWithIdTable.length === 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found payment id ${id}`, []));
        }

        let [bill, billDetail] = await BillService.FindOneById(billWithIdTable[0].idhoadon);
        if (!bill || bill.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found payment id ${id}`, []));
        }

        let resultStaff = await StaffService.FindOneById(bill[0].idnhanvien);

        let resultDetailOrder = [];

        let payment = 0;
        let discount = 0;

        for (let i = 0; i < billDetail.length; i++) {
            let [order, detailOrder] = await OrderDishService.FindOneById(billDetail[i].iddatmon);
            for (let index = 0; index < detailOrder.length; index++) {
                let element = detailOrder[index];

                payment += element.gia * element.soluong;

                let resultDetailBill = {};
                if (element.idmon != 100) {
                    let dishInfor = await DishService.FindOneById(element.idmon);
                    element.mon = dishInfor[0];
                    // payment = payment + (element.soluong * dishInfor[0].gia);
                    element.khuyenmai = {};
                } else {
                    if (element.idcombo != 100) {
                        let Promotion = await PromotionService.FindOneById(element.idcombo);
                        if (Promotion.length <= 0) {
                            console.log(FormatResponseJson(400, `Not found Promotion id ${id}`, []));
                        } else {
                            let ListDish = Promotion[1];
                            let LishDishDetail = [];
                            let totalPayment = 0;
                            for (let index = 0; index < ListDish.length; index++) {
                                const element = ListDish[index];
                                let resultDish = await DishService.FindOneById(element.idmon);
                                if (resultDish && resultDish.length > 0) {
                                    resultDish[0].soluong = element.soluong;
                                    LishDishDetail.push(resultDish[0]);
                                    totalPayment += resultDish[0].soluong * resultDish[0].gia;
                                }
                            }

                            Promotion[0][0].giamgia = ((totalPayment * Promotion[0][0].giatrikhuyenmai) / 100)
                            Promotion[0][0].thanhtoan = totalPayment - Promotion[0][0].giamgia;

                            element.khuyenmai = Promotion[0][0];
                            element.mon = LishDishDetail;

                            //payment += (Promotion[0][0].thanhtoan * element.soluong);

                            discount += (element.soluong * Promotion[0][0].giamgia);
                        }
                    }
                }
                delete element.idcombo;
                delete element.idmon;
                resultDetailBill = element;
                resultDetailOrder.push(resultDetailBill);
            }
        }

        let resultBillInfo = [{
            idhoadon: bill[0].idhoadon,
            idban: bill[0].idban,
            nhanvienlap: resultStaff[0],
            tennhanvien: resultStaff[0].hoten,
            ngaygiotao: bill[0].ngaygiotao,
            ngaygioxuat: bill[0].ngaygioxuat,
            trangthai: bill[0].trangthai,
            chitietdatmon: resultDetailOrder,
            thanhtoan: payment,
            giamgia: discount,
        }];

        return res.status(200).json(FormatResponseJson(200, "Successful", resultBillInfo));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}


const GetBillList = async (req, res) => {
    try {
        let billList = await BillService.FindAll();     //Lay danh sach hoa don
        if (billList.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found bill list`, []));
        }

        let resultBillList = [];                       //Bien chua ket qua danh sach hoa don sau khi format

        for (let l = 0; l < billList.length; l++) {     //Duyet qua tung phan tu cua danh sach hoa don
            let [bill, billDetail] = await BillService.FindOneById(billList[l][0][0].idhoadon);// Lay thong tin cua hoa don
            if (bill.length <= 0) {
                return res.status(400).json(FormatResponseJson(400, `Not found bill id ${billList[l].idhoadon}`, []));
            }

            let resultStaff = await StaffService.FindOneById(bill[0].idnhanvien); // Lay thong tin nhan vien lap hoa don

            let resultDetailOrder = [];
            let payment = 0;
            let discount = 0;

            for (let i = 0; i < billDetail.length; i++) {
                let [order, detailOrder] = await OrderDishService.FindOneById(billDetail[i].iddatmon);
                for (let index = 0; index < detailOrder.length; index++) {
                    let element = detailOrder[index];

                    payment += element.gia * element.soluong;

                    let resultDetailBill = {};
                    if (element.idmon != 100) {
                        let dishInfor = await DishService.FindOneById(element.idmon);
                        delete element.idmon;
                        element.mon = dishInfor[0];
                        // payment = payment + (element.soluong * dishInfor[0].gia);
                        element.khuyenmai = {};
                    } else {
                        if (element.idcombo != 100) {
                            let Promotion = await PromotionService.FindOneById(element.idcombo);
                            if (Promotion.length <= 0) {
                                console.log(FormatResponseJson(400, `Not found Promotion id ${id}`, []));
                            } else {
                                let ListDish = Promotion[1];
                                let LishDishDetail = [];
                                let totalPayment = 0;
                                for (let index = 0; index < ListDish.length; index++) {
                                    const element = ListDish[index];
                                    let resultDish = await DishService.FindOneById(element.idmon);
                                    if (resultDish && resultDish.length > 0) {
                                        resultDish[0].soluong = element.soluong;
                                        LishDishDetail.push(resultDish[0]);
                                        totalPayment += resultDish[0].soluong * resultDish[0].gia;
                                    }
                                }

                                Promotion[0][0].giamgia = ((totalPayment * Promotion[0][0].giatrikhuyenmai) / 100)
                                Promotion[0][0].thanhtoan = totalPayment - Promotion[0][0].giamgia;

                                element.khuyenmai = Promotion[0][0];
                                element.mon = LishDishDetail;

                                // payment += (Promotion[0][0].thanhtoan * element.soluong);

                                discount += (element.soluong * Promotion[0][0].giamgia);
                            }
                        }
                    }
                    delete element.idcombo;
                    delete element.idmon;
                    resultDetailBill = element;
                    resultDetailOrder.push(resultDetailBill);
                }
            }

            resultBillList.push({
                idhoadon: bill[0].idhoadon,
                idban: bill[0].idban,
                nhanvienlap: resultStaff[0],
                tennhanvien: resultStaff[0].hoten,
                ngaygiotao: bill[0].ngaygiotao,
                ngaygioxuat: bill[0].ngaygioxuat,
                trangthai: bill[0].trangthai,
                chitietdatmon: resultDetailOrder,
                thanhtoan: payment,
                giamgia: discount,
            });
        }

        return res.status(200).json(FormatResponseJson(200, "Successful", resultBillList));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const StatisticalBillWithMonth = async (req, res) => {  //Thong ke hoa don voi tung thang
    try {
        let billList = await BillService.FindAll();     //Lay danh sach hoa don
        if (billList.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found bill list`, []));
        }

        let staticticalInMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//Bien chua ket qua danh sach hoa don sau khi format

        for (let l = 0; l < billList.length; l++) {     //Duyet qua tung phan tu cua danh sach hoa don
            let [bill, billDetail] = await BillService.FindOneById(billList[l][0][0].idhoadon);// Lay thong tin cua hoa don
            if (bill.length <= 0) {
                return res.status(400).json(FormatResponseJson(400, `Not found bill id ${billList[l].idhoadon}`, []));
            }
            let payment = 0;

            for (let i = 0; i < billDetail.length; i++) { //Duyet qua tung dat mon trong chi tiet hoa  don
                let [order, detailOrder] = await OrderDishService.FindOneById(billDetail[i].iddatmon); // Lay thong tin mon
                for (let index = 0; index < detailOrder.length; index++) {
                    let element = detailOrder[index];

                    payment += element.gia * element.soluong;

                    if (element.idmon != 100) {
                        let dishInfor = await DishService.FindOneById(element.idmon);

                        //payment += (element.soluong * dishInfor[0].gia);
                    } else {
                        if (element.idcombo != 100) {
                            let Promotion = await PromotionService.FindOneById(element.idcombo);
                            if (Promotion.length <= 0) {
                                console.log(FormatResponseJson(400, `Not found Promotion id ${id}`, []));
                            } else {
                                let ListDish = Promotion[1];
                                let LishDishDetail = [];
                                let totalPayment = 0;
                                for (let index = 0; index < ListDish.length; index++) {
                                    const element = ListDish[index];
                                    let resultDish = await DishService.FindOneById(element.idmon);
                                    if (resultDish && resultDish.length > 0) {
                                        resultDish[0].soluong = element.soluong;
                                        LishDishDetail.push(resultDish[0]);
                                        totalPayment += resultDish[0].soluong * resultDish[0].gia;
                                    }
                                }

                                Promotion[0][0].giamgia = ((totalPayment * Promotion[0][0].giatrikhuyenmai) / 100)
                                Promotion[0][0].thanhtoan = totalPayment - Promotion[0][0].giamgia;

                                //payment += Promotion[0][0].thanhtoan;
                            }
                        }
                    }
                }
            }

            for (let index = 0; index < 12; index++) {
                if ((new Date(bill[0].ngaygioxuat).getMonth() + 1) == (index + 1)) {
                    staticticalInMonth[index] += payment;
                }
            }
        }

        return res.status(200).json(FormatResponseJson(200, "Successful", staticticalInMonth));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const StatisticalBillWithMonthAndYear = async (req, res) => { //Thong ke hoa don theo ngay voi thang va nam
    let { month, year } = req.params;

    try {
        let billList = await BillService.FindAllWithMonthAndYear(month, year);     //Lay danh sach hoa don
        if (billList.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found bill list`, []));
        }

        let staticticalInDay = [];//Bien chua ket qua danh sach hoa don sau khi format
        for (let index = 0; index < 31; index++) {
            staticticalInDay[index] = 0;
        }

        for (let l = 0; l < billList.length; l++) {     //Duyet qua tung phan tu cua danh sach hoa don
            let [bill, billDetail] = await BillService.FindOneById(billList[l][0][0].idhoadon);// Lay thong tin cua hoa don
            if (bill.length <= 0) {
                return res.status(400).json(FormatResponseJson(400, `Not found bill id ${billList[l].idhoadon}`, []));
            }
            let payment = 0;

            for (let i = 0; i < billDetail.length; i++) { //Duyet qua tung dat mon trong chi tiet hoa  don
                let [order, detailOrder] = await OrderDishService.FindOneById(billDetail[i].iddatmon); // Lay thong tin mon
                for (let index = 0; index < detailOrder.length; index++) {

                    let element = detailOrder[index];

                    payment += element.gia * element.soluong;

                    if (element.idmon != 100) {
                        let dishInfor = await DishService.FindOneById(element.idmon);

                        //payment += (element.soluong * dishInfor[0].gia);
                    } else {
                        if (element.idcombo != 100) {
                            let Promotion = await PromotionService.FindOneById(element.idcombo);
                            if (Promotion.length <= 0) {
                                console.log(FormatResponseJson(400, `Not found Promotion id ${id}`, []));
                            } else {
                                let ListDish = Promotion[1];
                                let LishDishDetail = [];
                                let totalPayment = 0;
                                for (let index = 0; index < ListDish.length; index++) {
                                    const element = ListDish[index];
                                    let resultDish = await DishService.FindOneById(element.idmon);
                                    if (resultDish && resultDish.length > 0) {
                                        resultDish[0].soluong = element.soluong;
                                        LishDishDetail.push(resultDish[0]);
                                        totalPayment += resultDish[0].soluong * resultDish[0].gia;
                                    }
                                }

                                Promotion[0][0].giamgia = ((totalPayment * Promotion[0][0].giatrikhuyenmai) / 100)
                                Promotion[0][0].thanhtoan = totalPayment - Promotion[0][0].giamgia;

                                //payment += Promotion[0][0].thanhtoan;
                            }
                        }
                    }
                }
            }
            for (let index = 0; index < 31; index++) {
                if ((new Date(bill[0].ngaygioxuat).getDate()) == (index + 1)) {
                    staticticalInDay[index] += payment;
                }
            }
        }

        return res.status(200).json(FormatResponseJson(200, "Successful", staticticalInDay));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}


const GetBillListWhereTime = async (req, res) => {
    let { start, end } = req.params;

    if (!start || !end) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }

    try {
        let billList = await BillService.FindAllWhereTime(start, end);     //Lay danh sach hoa don trong giai doan

        if (billList.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found bill list`, []));
        }

        let resultBillList = [];                       //Bien chua ket qua danh sach hoa don sau khi format

        for (let l = 0; l < billList.length; l++) {     //Duyet qua tung phan tu cua danh sach hoa don
            let [bill, billDetail] = await BillService.FindOneById(billList[l][0][0].idhoadon);// Lay thong tin cua hoa don
            if (bill.length <= 0) {
                return res.status(400).json(FormatResponseJson(400, `Not found bill id ${billList[l].idhoadon}`, []));
            }

            let resultStaff = await StaffService.FindOneById(bill[0].idnhanvien); // Lay thong tin nhan vien lap hoa don

            let resultDetailOrder = [];
            let payment = 0;
            let discount = 0;

            for (let i = 0; i < billDetail.length; i++) {
                let [order, detailOrder] = await OrderDishService.FindOneById(billDetail[i].iddatmon);
                for (let index = 0; index < detailOrder.length; index++) {
                    let element = detailOrder[index];
                    payment += element.gia * element.soluong;
                    let resultDetailBill = {};
                    if (element.idmon != 100) {
                        let dishInfor = await DishService.FindOneById(element.idmon);
                        delete element.idmon;
                        element.mon = dishInfor[0];
                        // payment = payment + (element.soluong * dishInfor[0].gia);
                        element.khuyenmai = {};
                    } else {
                        if (element.idcombo != 100) {
                            let Promotion = await PromotionService.FindOneById(element.idcombo);
                            if (Promotion.length <= 0) {
                                console.log(FormatResponseJson(400, `Not found Promotion id ${id}`, []));
                            } else {
                                let ListDish = Promotion[1];
                                let LishDishDetail = [];
                                let totalPayment = 0;
                                for (let index = 0; index < ListDish.length; index++) {
                                    const element = ListDish[index];
                                    let resultDish = await DishService.FindOneById(element.idmon);
                                    if (resultDish && resultDish.length > 0) {
                                        resultDish[0].soluong = element.soluong;
                                        LishDishDetail.push(resultDish[0]);
                                        totalPayment += resultDish[0].soluong * resultDish[0].gia;
                                    }
                                }

                                Promotion[0][0].giamgia = ((totalPayment * Promotion[0][0].giatrikhuyenmai) / 100)
                                Promotion[0][0].thanhtoan = totalPayment - Promotion[0][0].giamgia;

                                element.khuyenmai = Promotion[0][0];
                                element.mon = LishDishDetail;

                                //payment += (Promotion[0][0].thanhtoan * element.soluong);

                                discount += (element.soluong * Promotion[0][0].giamgia);
                            }
                        }
                    }
                    delete element.idcombo;
                    delete element.idmon;
                    resultDetailBill = element;
                    resultDetailOrder.push(resultDetailBill);
                }
            }

            resultBillList.push({
                idhoadon: bill[0].idhoadon,
                idban: bill[0].idban,
                nhanvienlap: resultStaff[0],
                tennhanvien: resultStaff[0].hoten,
                ngaygiotao: bill[0].ngaygiotao,
                ngaygioxuat: bill[0].ngaygioxuat,
                trangthai: bill[0].trangthai,
                chitietdatmon: resultDetailOrder,
                thanhtoan: payment,
                giamgia: discount,
            });
        }
        return res.status(200).json(FormatResponseJson(200, "Successful", resultBillList));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const GetListBillInDate = async (req, res) => {
    let { date } = req.params;
    date = new Date(date);
    if (!date) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }

    try {
        let billList = await BillService.FindAllInDate(date);     //Lay danh sach hoa don trong ngay
        if (billList.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found bill list`, []));
        }

        let resultBillList = [];                       //Bien chua ket qua danh sach hoa don sau khi format

        for (let l = 0; l < billList.length; l++) {     //Duyet qua tung phan tu cua danh sach hoa don
            let [bill, billDetail] = await BillService.FindOneById(billList[l][0][0].idhoadon);// Lay thong tin cua hoa don
            if (bill.length <= 0) {
                return res.status(400).json(FormatResponseJson(400, `Not found bill id ${billList[l].idhoadon}`, []));
            }

            let resultStaff = await StaffService.FindOneById(bill[0].idnhanvien); // Lay thong tin nhan vien lap hoa don

            let resultDetailOrder = [];  // Bien luu thong tin chi tiet dat mon
            let payment = 0;
            let discount = 0;

            for (let i = 0; i < billDetail.length; i++) {
                let [order, detailOrder] = await OrderDishService.FindOneById(billDetail[i].iddatmon);
                for (let index = 0; index < detailOrder.length; index++) {
                    let element = detailOrder[index];
                    payment += element.gia * element.soluong;
                    let resultDetailBill = {};
                    if (element.idmon != 100) {
                        let dishInfor = await DishService.FindOneById(element.idmon);
                        delete element.idmon;
                        element.mon = dishInfor[0];
                        // payment = payment + (element.soluong * dishInfor[0].gia);
                        element.khuyenmai = {};
                    } else {
                        if (element.idcombo != 100) {
                            let Promotion = await PromotionService.FindOneById(element.idcombo);
                            if (Promotion.length <= 0) {
                                console.log(FormatResponseJson(400, `Not found Promotion id ${id}`, []));
                            } else {
                                let ListDish = Promotion[1];
                                let LishDishDetail = [];
                                let totalPayment = 0;
                                for (let index = 0; index < ListDish.length; index++) {
                                    const element = ListDish[index];
                                    let resultDish = await DishService.FindOneById(element.idmon);
                                    if (resultDish && resultDish.length > 0) {
                                        resultDish[0].soluong = element.soluong;
                                        LishDishDetail.push(resultDish[0]);
                                        totalPayment += resultDish[0].soluong * resultDish[0].gia;
                                    }
                                }

                                Promotion[0][0].giamgia = ((totalPayment * Promotion[0][0].giatrikhuyenmai) / 100)
                                Promotion[0][0].thanhtoan = totalPayment - Promotion[0][0].giamgia;

                                element.khuyenmai = Promotion[0][0];
                                element.mon = LishDishDetail;

                                //payment += (Promotion[0][0].thanhtoan * element.soluong);

                                discount += (element.soluong * Promotion[0][0].giamgia);
                            }
                        }
                    }
                    delete element.idcombo;
                    delete element.idmon;
                    resultDetailBill = element;
                    resultDetailOrder.push(resultDetailBill);
                }
            }

            resultBillList.push({
                idhoadon: bill[0].idhoadon,
                idban: bill[0].idban,
                nhanvienlap: resultStaff[0],
                tennhanvien: resultStaff[0].hoten,
                ngaygiotao: bill[0].ngaygiotao,
                ngaygioxuat: bill[0].ngaygioxuat,
                trangthai: bill[0].trangthai,
                chitietdatmon: resultDetailOrder,
                thanhtoan: payment,
                giamgia: discount,
            });
        }
        return res.status(200).json(FormatResponseJson(200, "Successful", resultBillList));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}


const NewBill = async (req, res) => {
    let billNew = req.body;
    //console.log(paymentNew.idStaff, paymentNew.idSupplier, paymentNew.time, paymentNew.idGoods, paymentNew.quantity, paymentNew.price);
    if (!billNew.idTable || !billNew.timeCreate) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }

    try {
        let result = await BillService.Create(billNew);
        if (result.length > 0) {
            return res.status(200).json(FormatResponseJson(200, "Create payment successful!", result));
        }
        return res.status(401).json(FormatResponseJson(401, "Create payment failed!", []));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const UpdateStatusBill = async (req, res) => { // Khi xuat hoa don thanh toan theo id ban
    let idTable = req.params.idtable;
    let { token } = req.body;
    let timePrint = new Date();
    // if (!timePrint) {
    //     return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    // }

    if (!idTable) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    } else {
        idTable = Number(idTable);
        if (isNaN(idTable)) {
            return res.status(404).json(FormatResponseJson(404, "Id is not Number", []));
        }
    }

    try {
        let idStaff = JWT.getUserIdFromToken(token);
        let resultIdWithTable = await BillService.FindOneByIdTableNew(idTable);
        if (resultIdWithTable.length != 0) {
            let result = await BillService.UpdateStatus(resultIdWithTable[0].idhoadon, idStaff, timePrint);

            await TableService.Update(result[0][0].idban); // Cap nhat lai trang thai ban rong khi thanh toan
            if (!result || result.length === 0) {
                return res.status(401).json(FormatResponseJson(401, "Update payment failed!", []));
            }
            return res.status(200).json(FormatResponseJson(200, "Updated payment successful!", result));
        }
        return res.status(400).json(FormatResponseJson(400, "Can not found bill of id table.", []));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

// const DeletePayment = async (req, res) => {
//     let id = req.params.id;
//     if (!id) {
//         return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
//     }

//     try {
//         let Payment = await PaymentService.FindOneById(id);

//         if (Payment.length === 0) {
//             return res.status(404).json(FormatResponseJson(404, "Payment is not found!", []));
//         }

//         let idPaymentDelete = await PaymentService.Delete(id);
//         if (idPaymentDelete !== 0) {
//             return res.status(200).json(FormatResponseJson(200, "Deleted Payment successful!", [{ "idphieuchi": idPaymentDelete }]));
//         }
//         return res.status(401).json(FormatResponseJson(401, "Delete Payment failed!", []));

//     } catch (e) {
//         console.log(e);
//         return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
//     }
// }

export {
    GetBill,                //Lay thong tin hoa don voi idhoadon
    GetBillWithIdTable,     //Lay thong tin hoa don voi idban
    GetBillEating,          //Lay thong tin hoa don ban dang an => trang thai hoa don = 0 (chua thanh toan)
    GetBillList,            //Lay tat ca cac hoa don
    GetBillListWhereTime,   //Lay danh sach hoa don voi tung giai doan
    GetListBillInDate,      //Lay danh sach hoa don trong 1 ngay
    NewBill,                //Tao hoa don moi
    UpdateStatusBill,       //Cap nhat trang thai thai thanh toan hoa don
    //DeletePayment,
    StatisticalBillWithMonth,   //Thong ke hoa don theo thang
    StatisticalBillWithMonthAndYear //Thong ke hoa don theo thang va trong 1 nam
}
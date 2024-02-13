import BillService from "../Services/BillService.js";
import StaffService from "../Services/StaffService.js";
import OrderDishService from "../Services/OrderDishService.js";
import DishService from "../Services/DishService.js";
import TableService from "../Services/TableService.js";

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
        if (bill.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found payment id ${id}`, []));
        }

        let resultStaff = await StaffService.FindOneById(bill[0].idnhanvien);

        let resultDetailOrder = [];
        let payment = 0;
        for (let i = 0; i < billDetail.length; i++) {
            let [order, detailOrder] = await OrderDishService.FindOneById(billDetail[i].iddatmon);
            for (let index = 0; index < detailOrder.length; index++) {
                let element = detailOrder[index];
                let dishInfor = await DishService.FindOneById(element.idmon);

                delete element.idmon;
                element.mon = dishInfor[0];

                payment = payment + element.soluong * dishInfor[0].gia;

                resultDetailOrder.push(element);
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
        }];

        return res.status(200).json(FormatResponseJson(200, "Successful", resultBillInfo));
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
        let [bill, billDetail] = await BillService.FindOneById(billWithIdTable[0].idhoadon);
        if (bill.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found payment id ${id}`, []));
        }

        let resultStaff = await StaffService.FindOneById(bill[0].idnhanvien);

        let resultDetailOrder = [];
        let payment = 0;
        for (let i = 0; i < billDetail.length; i++) {
            let [order, detailOrder] = await OrderDishService.FindOneById(billDetail[i].iddatmon);
            for (let index = 0; index < detailOrder.length; index++) {
                let element = detailOrder[index];
                let dishInfor = await DishService.FindOneById(element.idmon);


                delete element.idmon;
                element.mon = dishInfor[0];
                payment += dishInfor[0].gia * element.soluong;
                resultDetailOrder.push(element);
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

            let resultDetailOrder = [];  // Bien luu thong tin chi tiet dat mon
            let payment = 0;

            for (let i = 0; i < billDetail.length; i++) { //Duyet qua tung dat mon trong chi tiet hoa  don
                let [order, detailOrder] = await OrderDishService.FindOneById(billDetail[i].iddatmon); // Lay thong tin mon
                for (let index = 0; index < detailOrder.length; index++) {
                    let element = detailOrder[index];
                    let dishInfor = await DishService.FindOneById(element.idmon);

                    delete element.idmon;
                    element.mon = dishInfor[0];
                    payment += element.soluong * dishInfor[0].gia;
                    resultDetailOrder.push(element);
                }
            }

            let resultBillInfo = {
                idhoadon: bill[0].idhoadon,
                idban: bill[0].idban,
                nhanvienlap: resultStaff[0],
                tennhanvien: resultStaff[0].hoten,
                ngaygiotao: bill[0].ngaygiotao,
                ngaygioxuat: bill[0].ngaygioxuat,
                trangthai: bill[0].trangthai,
                chitietdatmon: resultDetailOrder,
                giamgia: 0,
                thanhtoan: payment,
            };

            resultBillList.push(resultBillInfo);
        }
        return res.status(200).json(FormatResponseJson(200, "Successful", resultBillList));
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

            let resultDetailOrder = [];  // Bien luu thong tin chi tiet dat mon
            let payment = 0;
            for (let i = 0; i < billDetail.length; i++) { //Duyet qua tung dat mon trong chi tiet hoa  don
                let [order, detailOrder] = await OrderDishService.FindOneById(billDetail[i].iddatmon); // Lay thong tin mon
                for (let index = 0; index < detailOrder.length; index++) {
                    let element = detailOrder[index];
                    let dishInfor = await DishService.FindOneById(element.idmon);

                    delete element.idmon;
                    element.mon = dishInfor[0];
                    payment += dishInfor[0].gia * element.soluong;
                    resultDetailOrder.push(element);
                }
            }

            let resultBillInfo = {
                idhoadon: bill[0].idhoadon,
                idban: bill[0].idban,
                nhanvienlap: resultStaff[0],
                tennhanvien: resultStaff[0].hoten,
                ngaygiotao: bill[0].ngaygiotao,
                ngaygioxuat: bill[0].ngaygioxuat,
                trangthai: bill[0].trangthai,
                chitietdatmon: resultDetailOrder,
                giamgia: 0,
                thanhtoan: payment,
            };

            resultBillList.push(resultBillInfo);
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
    if (!billNew.idStaff || !billNew.idTable || !billNew.timeCreate) {
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
    let { timePrint, idStaff } = req.body;

    if (!timePrint) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }

    if (!idTable) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    } else {
        idTable = Number(idTable);
        if (isNaN(idTable)) {
            return res.status(404).json(FormatResponseJson(404, "Id is not Number", []));
        }
    }

    try {
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
    GetBill,
    GetBillWithIdTable,
    GetBillList,
    GetBillListWhereTime,
    NewBill,
    UpdateStatusBill,
    //DeletePayment
}
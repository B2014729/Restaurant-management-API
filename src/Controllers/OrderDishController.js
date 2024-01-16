import DishService from "../Services/DishService.js";
import StaffService from "../Services/StaffService.js";
import OrderDishService from "../Services/OrderDishService.js";

import FormatResponseJson from "../Services/FotmatResponse.js";
import BillService from "../Services/BillService.js";
import TableService from "../Services/TableService.js";

const GetOrderDish = async (req, res) => {
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
        let result = await OrderDishService.FindOneById(id);
        if (result.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found payment id ${id}`, []));
        }

        let orderDish = result[0][0];
        let orderDishDetail = result[1];

        let resultStaff = await StaffService.FindOneById(orderDish.idnhanvien);
        let resultDetail = [];

        for (let i = 0; i < orderDishDetail.length; i++) {
            let result = await DishService.FindOneById(orderDishDetail[i].idmon);
            resultDetail[i] = {
                mon: result[0],
                soluong: orderDishDetail[i].soluong,
                trangthai: orderDishDetail[i].trangthai,
            }
        }

        let resultOrderDish = [{
            iddatmon: orderDish.iddatmon,
            idban: orderDish.idban,
            trangthai: orderDish.trangthai,
            nhanvien: resultStaff[0],
            thoidiemdat: orderDish.thoidiemdat,
            thongtinhchitiet: resultDetail
        }]

        return res.status(200).json(FormatResponseJson(200, "Successful", resultOrderDish));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}

const GetOrderDishList = async (req, res) => {
    try {
        let orderDishList = await OrderDishService.FindAll();
        if (orderDishList.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found order dish list`, []));
        }

        let resultOrderDishList = [];

        for (let i = 0; i < orderDishList.length; i++) {
            let orderDish = orderDishList[i][0][0];
            let orderDishDetail = orderDishList[i][1];

            let resultStaff = await StaffService.FindOneById(orderDish.idnhanvien);
            let resultDetail = [];

            for (let i = 0; i < orderDishDetail.length; i++) {
                let result = await DishService.FindOneById(orderDishDetail[i].idmon);
                resultDetail[i] = {
                    mon: result[0],
                    soluong: orderDishDetail[i].soluong,
                    trangthai: orderDishDetail[i].trangthai,
                }
            }

            resultOrderDishList.push({
                iddatmon: orderDish.iddatmon,
                idban: orderDish.idban,
                trangthai: orderDish.trangthai,
                nhanvien: resultStaff[0],
                thoidiemdat: orderDish.thoidiemdat,
                thongtinchitiet: resultDetail
            });
        }

        return res.status(200).json(FormatResponseJson(200, "Successful", resultOrderDishList));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const NewOrderDish = async (req, res) => {
    let orderNew = req.body;

    orderNew.idStaff = 3; //TEST

    const now = new Date();
    orderNew.dateTime = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;

    if (!orderNew.token || !orderNew.idTable || (orderNew.status === undefined) || (orderNew.idDish.length === 0) || (orderNew.quantity.length === 0)) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }
    if (orderNew.idDish.length !== orderNew.quantity.length) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }

    try {
        let result = await OrderDishService.Create(orderNew);

        if (result.length > 0) {
            if (orderNew.status == 0) {// trang thai ban moi dat mon
                let billInfo = {
                    idStaff: 6,// nhan vien mac dinh khi tao hoa don ==> cap nhat lai id cua nhan vien khi nhan vien xuat hoa don thanh toan
                    timeCreate: orderNew.dateTime,
                    idTable: orderNew.idTable
                };
                let resultBill = await BillService.Create(billInfo); // Tao hoa don cho ban moi
                await BillService.AddDetailBill(resultBill[0].idhoadon, result[0][0].iddatmon);
                await TableService.Update(orderNew.idTable);// Cap nhat trang thai ban co  khach (trangthai = 1)

            } else {  // Trang thai them mon
                let bill = await BillService.FindOneByIdTableNew(orderNew.idTable);
                if (bill.length > 0) {
                    await BillService.AddDetailBill(bill[0].idhoadon, result[0][0].iddatmon);
                }
            }

            return res.status(200).json(FormatResponseJson(200, "Create payment successful!", result));
        }

        return res.status(401).json(FormatResponseJson(401, "Create payment failed!", []));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

// const UpdatePayment = async (req, res) => {
//     let id = req.params.id;
//     let updatePayment = req.body;
//     if (!updatePayment.idStaff || !updatePayment.idSupplier || !updatePayment.time || !updatePayment.idGoods || !updatePayment.quantity || !updatePayment.price) {
//         return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
//     }

//     if (updatePayment.idGoods.length !== updatePayment.quantity.length || updatePayment.statusDish.length !== updatePayment.idGoods.length) {
//         return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
//     }

//     if (!id) {
//         return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
//     } else {
//         id = Number(id);
//         if (isNaN(id)) {
//             return res.status(404).json(FormatResponseJson(404, "Id is not Number", []));
//         }
//     }

//     try {
//         let result = await OrderDishService.Update(id, updatePayment);
//         if (!result || result.length === 0) {
//             return res.status(401).json(FormatResponseJson(401, "Update payment failed!", []));
//         }
//         return res.status(200).json(FormatResponseJson(200, "Updated payment successful!", [result]));

//     } catch (e) {
//         console.log(e);
//         return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
//     }
// }

const PayDish = async (req, res) => {  //Tra mon => Cap nhat trang thai mon da tra
    let idOrder = req.params.id;
    let { idDish } = req.body;
    if (!idOrder || !idDish) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }
    if (!idOrder) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    } else {
        idOrder = Number(idOrder);
        if (isNaN(idOrder)) {
            return res.status(404).json(FormatResponseJson(404, "Id is not Number", []));
        }
    }

    try {
        let result = await OrderDishService.UpdateStatusDish(idOrder, idDish);
        if (!result || result.length === 0) {
            return res.status(401).json(FormatResponseJson(401, "Update payment failed!", []));
        }
        return res.status(200).json(FormatResponseJson(200, "Updated payment successful!", [result]));
    } catch (error) {
        console.log(error);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}


const DeleteOrderDish = async (req, res) => {
    let id = req.params.id;
    if (!id) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    }

    try {
        let orderDish = await OrderDishService.FindOneById(id);

        if (orderDish.length === 0) {
            return res.status(404).json(FormatResponseJson(404, "Order dish is not found!", []));
        }

        let idOrderDishDelete = await OrderDishService.Delete(id);
        if (idOrderDishDelete !== 0) {
            return res.status(200).json(FormatResponseJson(200, "Deleted order  dish successful!", [{ "iddatmon": idOrderDishDelete }]));
        }
        return res.status(401).json(FormatResponseJson(401, "Delete order dish failed!", []));

    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}

export {
    GetOrderDish,
    GetOrderDishList,
    NewOrderDish,
    // UpdatePayment,
    PayDish,
    DeleteOrderDish
}
import GoodsService from "../Services/GoodsService.js";
import PaymentService from "../Services/PaymentService.js";
import StaffService from "../Services/StaffService.js";
import SupplierService from "../Services/SupplierService.js";
import UnitService from "../Services/UnitService.js";
import FormatResponseJson from "../Services/FotmatResponse.js";
import DepotService from "../Services/DepotService.js";

const GetPayment = async (req, res) => {
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
        let result = await PaymentService.FindOneById(id);
        if (result.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found payment id ${id}`, []));
        }

        let payment = result[0][0];
        let paymentDetail = result[1];

        let resultStaff = await StaffService.FindOneById(payment.idnhanvien);
        let resultSupplier = await SupplierService.FindOneById(payment.idnhacungcap);
        let resultDetail = [];

        let amount = 0;

        for (let i = 0; i < paymentDetail.length; i++) {
            let result = await GoodsService.FindOneById(paymentDetail[i].idhanghoa);
            amount += (paymentDetail[i].soluong * paymentDetail[i].dongia);

            let unit = await UnitService.FindOneById(result[0].iddonvitinh);
            result[0].donvitinh = unit[0].tendonvi;

            resultDetail[i] = {
                hanghoa: result[0],
                soluong: paymentDetail[i].soluong,
                dongia: paymentDetail[i].dongia,
                giam: 0,
            }
        }

        let resultPayment = [{
            idphieuchi: payment.idphieuchi,
            nhanvien: resultStaff[0],
            nhacungcap: resultSupplier[0],
            ngaygio: payment.ngaygio,
            thanhtoan: amount,
            thongtinchitiet: resultDetail,
        }]

        return res.status(200).json(FormatResponseJson(200, "Successful", resultPayment));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}

const GetPaymentList = async (req, res) => {
    try {
        let paymentList = await PaymentService.FindAll();
        if (paymentList.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found payment list`, []));
        }

        let resultPaymentList = [];

        for (let i = 0; i < paymentList.length; i++) {
            let amount = 0;
            let payment = paymentList[i][0][0];
            let paymentDetail = paymentList[i][1];

            let resultStaff = await StaffService.FindOneById(payment.idnhanvien);
            let resultSupplier = await SupplierService.FindOneById(payment.idnhacungcap);
            let resultDetail = [];

            for (let i = 0; i < paymentDetail.length; i++) {
                let result = await GoodsService.FindOneById(paymentDetail[i].idhanghoa);
                amount += (paymentDetail[i].soluong * paymentDetail[i].dongia);

                let unit = await UnitService.FindOneById(result[0].iddonvitinh);

                result[0].donvitinh = unit.tendonvi;
                resultDetail[i] = {
                    hanghoa: result[0],
                    soluong: paymentDetail[i].soluong,
                    dongia: paymentDetail[i].dongia,
                    giam: 0,
                }
            }

            resultPaymentList.push({
                idphieuchi: payment.idphieuchi,
                nhanvien: resultStaff[0],
                nhacungcap: resultSupplier[0],
                ngaygio: payment.ngaygio,
                thanhtoan: amount,
                thongtinchitiet: resultDetail,
            });
        }

        return res.status(200).json(FormatResponseJson(200, "Successful", resultPaymentList));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}


const StatisticalPaymentInMonth = async (req, res) => {
    try {
        let paymentList = await PaymentService.FindAll();
        if (paymentList.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found payment list`, []));
        }

        let resultStatisticalInMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];

        for (let i = 0; i < paymentList.length; i++) {
            let amount = 0;
            let payment = paymentList[i][0][0];
            let paymentDetail = paymentList[i][1];

            for (let i = 0; i < paymentDetail.length; i++) {
                amount += (paymentDetail[i].soluong * paymentDetail[i].dongia);
            }

            for (let index = 0; index < 12; index++) {
                if ((new Date(payment.ngaygio).getMonth() + 1) == (index + 1)) {
                    resultStatisticalInMonth[index] += amount;
                }
            }
        }

        return res.status(200).json(FormatResponseJson(200, "Successful", resultStatisticalInMonth));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const NewPayment = async (req, res) => {
    let paymentNew = req.body;
    // console.log(paymentNew.idStaff, paymentNew.idSupplier, paymentNew.time, paymentNew.idGoods, paymentNew.quantity, paymentNew.price);
    if (!paymentNew.idStaff || !paymentNew.idSupplier || !paymentNew.time || !paymentNew.idGoods || !paymentNew.quantity || !paymentNew.price || !paymentNew.dates) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }

    if (paymentNew.idGoods.length !== paymentNew.quantity.length || paymentNew.price.length !== paymentNew.idGoods.length) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }

    try {
        let result = await PaymentService.Create(paymentNew);
        let goodsNew = {};
        for (let index = 0; index < paymentNew.idGoods.length; index++) {
            goodsNew = {
                idGoods: paymentNew.idGoods[index],
                quantity: paymentNew.quantity[index],
                date: paymentNew.time,
            }
            await DepotService.Create(goodsNew);
            await GoodsService.UpdateDateManufacture(paymentNew.idGoods[index], paymentNew.dates[index],)
        }

        if (result.length > 0) {
            return res.status(200).json(FormatResponseJson(200, "Create payment successful!", result));
        }
        return res.status(401).json(FormatResponseJson(401, "Create payment failed!", []));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const UpdatePayment = async (req, res) => {
    let id = req.params.id;
    let updatePayment = req.body;
    if (!updatePayment.idStaff || !updatePayment.idSupplier || !updatePayment.time || !updatePayment.idGoods || !updatePayment.quantity || !updatePayment.price) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }

    if (updatePayment.idGoods.length !== updatePayment.quantity.length || updatePayment.price.length !== updatePayment.idGoods.length) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }

    if (!id) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    } else {
        id = Number(id);
        if (isNaN(id)) {
            return res.status(404).json(FormatResponseJson(404, "Id is not Number", []));
        }
    }

    try {
        let result = await PaymentService.Update(id, updatePayment);
        if (!result || result.length === 0) {
            return res.status(401).json(FormatResponseJson(401, "Update payment failed!", []));
        }
        return res.status(200).json(FormatResponseJson(200, "Updated payment successful!", [result]));

    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const DeletePayment = async (req, res) => {
    let id = req.params.id;
    if (!id) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    }

    try {
        let Payment = await PaymentService.FindOneById(id);

        if (Payment.length === 0) {
            return res.status(404).json(FormatResponseJson(404, "Payment is not found!", []));
        }

        let idPaymentDelete = await PaymentService.Delete(id);
        if (idPaymentDelete !== 0) {
            return res.status(200).json(FormatResponseJson(200, "Deleted Payment successful!", [{ "idphieuchi": idPaymentDelete }]));
        }
        return res.status(401).json(FormatResponseJson(401, "Delete Payment failed!", []));

    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}

export {
    GetPayment,
    GetPaymentList,
    NewPayment,
    UpdatePayment,
    DeletePayment,
    StatisticalPaymentInMonth
}
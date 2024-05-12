import connection from "../Configs/ConnectDB.js";
import DishService from "./DishService.js";
import PromotionService from "./PromotionService.js";

class OrderDishService {

    async FindOneById(id) {
        try {
            let [result, field] = await connection.execute("SELECT * FROM datmon WHERE iddatmon = ?", [id]);
            let [resultDetail, fieldDetail] = await connection.execute("SELECT * FROM chitietdatmon WHERE iddatmon = ?", [id]);
            if (result.length === 1) {
                return [result, resultDetail];
            } else {
                return [];
            }
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async FindAll() {
        try {
            let result = [];
            let [resultQuery, field] = await connection.execute("SELECT iddatmon FROM datmon ORDER BY thoidiemdat DESC");
            for (let i = 0; i < resultQuery.length; i++) {
                let resultOrderDish = await new OrderDishService().FindOneById(resultQuery[i].iddatmon);
                result[i] = resultOrderDish;
            }
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async FindAllDishPaidInDate(date) {
        let dateFormat = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 00:00:00`;
        try {
            let [resultQuery, field] = await connection.execute("SELECT * FROM chitietdatmon WHERE tramon >= ? AND trangthai = 1 ORDER BY tramon DESC", [dateFormat]);
            if (resultQuery.length > 0) {
                return resultQuery;
            }
            return [];
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async FindAllInDateAndNoSendKitchen(date) {
        let dateFormat = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 00:00:00`;

        try {
            let [resultQuery, field] = await connection.execute("SELECT * FROM datmon WHERE thoidiemdat >= ? AND trangthaiguibep = ?", [dateFormat, 0]);
            if (resultQuery.length > 0) {
                return resultQuery;
            }
            return [];
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Create(OrderNew) {
        try {
            let { idStaff, dateTime, idTable, status, idDish, quantity, note } = OrderNew;
            //console.log(idStaff, dateTime, idTable, status, idDish, quantity, note);
            await connection.execute("INSERT INTO `datmon`(`idnhanvien`, `thoidiemdat`, `idban`, `trangthai`, `trangthaiguibep`) VALUES (?,?,?,?,0)", [idStaff, dateTime, idTable, status]);

            let [result, field] = await connection.execute("SELECT * FROM datmon ORDER BY iddatmon DESC LIMIT 1;");

            for (let i = 0; i < idDish.length; i++) {
                let noteDishOrder = note[i] ? note[i] : null;
                let price = 0;
                if (Number.isInteger(idDish[i])) {
                    let dish = await DishService.FindOneById(idDish[i]);
                    price = dish[0].gia;
                    await connection.execute("INSERT INTO `chitietdatmon`(`iddatmon`, `idmon`, `idcombo`, `trangthai`, `soluong`, `ghichu`,`idnhanvien`, `gia`) VALUES (?,?,?,?,?,?,?,?)", [result[0].iddatmon, idDish[i], 100, 0, quantity[i], noteDishOrder, idStaff, price]);
                } else {
                    let [promotion, detailPromotion] = await PromotionService.FindOneById(idDish[i]);
                    price = promotion[0].gia;
                    await connection.execute("INSERT INTO `chitietdatmon`(`iddatmon`, `idmon`, `idcombo`, `trangthai`, `soluong`, `ghichu`,`idnhanvien`, `gia`) VALUES (?,?,?,?,?,?,?,?)", [result[0].iddatmon, 100, idDish[i], 0, quantity[i], noteDishOrder, idStaff, price]);
                }
            }

            let order = await new OrderDishService().FindOneById(result[0].iddatmon);
            return order;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    // async Update(idPayment, updatePayment) {
    //     try {
    //         let { idStaff, idSupplier, time, idGoods, quantity, price } = updatePayment;
    //         await connection.execute("UPDATE `phieuchi` SET `idnhanvien`= ?,`idnhacungcap`= ?,`ngaygio`= ? WHERE idphieuchi = ?", [idStaff, idSupplier, time, idPayment]);

    //         for (let i = 0; i < idGoods.length; i++) {
    //             await connection.execute("DELETE FROM `chitietphieuchi`WHERE idphieuchi = ?", [idPayment]);
    //         }
    //         for (let i = 0; i < idGoods.length; i++) {
    //             await connection.execute("INSERT INTO `chitietphieuchi`(`idphieuchi`, `idhanghoa`, `soluong`, `dongia`) VALUES (?,?,?,?)", [idPayment, idGoods[i], quantity[i], price[i]]);
    //         }

    //         let result = await new OrderDishService().FindOneById(idPayment);
    //         return result;

    //     } catch (e) {
    //         console.log(e);
    //         return [];
    //     }
    // }

    async UpdateStatusDish(idOrder, idDish, dateTime, idStaff) {// Cap nhat trang thai tra mon
        try {
            await connection.execute("UPDATE chitietdatmon SET trangthai = 1, tramon = ?, idnhanvien = ? WHERE iddatmon = ? AND idmon = ?;", [dateTime, idStaff, idOrder, idDish]);
            let [result, resultDetail] = await new OrderDishService().FindOneById(idOrder);

            if (!result) {
                return [];
            }
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async UpdateStatusCombo(idOrder, idCombo, dateTime, idStaff) {// Cap nhat trang thai tra mon
        try {
            await connection.execute("UPDATE chitietdatmon SET trangthai = 1, tramon = ?, idnhanvien = ? WHERE iddatmon = ? AND idcombo = ?;", [dateTime, idStaff, idOrder, idCombo]);
            let [result, resultDetail] = await new OrderDishService().FindOneById(idOrder);

            if (!result) {
                return [];
            }
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async UpdateStatusSendToKitchen(idOrder) {
        try {
            await connection.execute("UPDATE datmon SET trangthaiguibep = 1 WHERE  iddatmon = ?;", [idOrder]);
            let [result, resultDetail] = await new OrderDishService().FindOneById(idOrder);
            if (!result) {
                return [];
            }
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }


    async Delete(idOrder) {
        try {
            await connection.execute("DELETE FROM `chitietdatmon` WHERE iddatmon = ?", [idOrder]);
            await connection.execute("DELETE FROM `datmon` WHERE iddatmon = ?", [idOrder])
            let result = await new OrderDishService().FindOneById(idOrder);
            if (result.length === 0) {
                return idOrder;
            }
        } catch (e) {
            console.log(e);
            return 0;
        }
    }
}

export default new OrderDishService();
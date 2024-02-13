import connection from "../Configs/ConnectDB.js";

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
            let [resultQuery, field] = await connection.execute("SELECT iddatmon FROM datmon ORDER BY thoidiemdat");
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

    async Create(OrderNew) {
        try {
            let { idStaff, dateTime, idTable, status, idDish, quantity, note } = OrderNew;
            //console.log(idStaff, dateTime, idTable, status, idDish, quantity, note);
            await connection.execute("INSERT INTO `datmon`(`idnhanvien`, `thoidiemdat`, `idban`, `trangthai`) VALUES (?,?,?,?)", [idStaff, dateTime, idTable, status]);

            let [result, field] = await connection.execute("SELECT * FROM datmon ORDER BY iddatmon DESC LIMIT 1;");

            for (let i = 0; i < idDish.length; i++) {
                let noteDishOrder = note[i] ? note[i] : null;
                await connection.execute("INSERT INTO `chitietdatmon`(`iddatmon`, `idmon`, `trangthai`, `soluong`, `ghichu`) VALUES (?,?,0,?,?)", [result[0].iddatmon, idDish[i], quantity[i], noteDishOrder]);
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

    async UpdateStatusDish(idOrder, idDish) {
        try {
            console.log(idOrder, idDish);
            await connection.execute("UPDATE chitietdatmon SET trangthai = 1 WHERE iddatmon = ? AND idmon = ?;", [idOrder, idDish]);
            let result = await new OrderDishService().FindOneById(idOrder);
            console.log(result);
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
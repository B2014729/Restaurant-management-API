import connection from "../Configs/ConnectDB.js";

class PaymentService {
    async FindOneById(id) {
        try {
            let [result, field] = await connection.execute("SELECT * FROM phieuchi WHERE idphieuchi = ?", [id]);
            let [resultDetail, fieldDetail] = await connection.execute("SELECT * FROM chitietphieuchi WHERE idphieuchi = ?", [id]);
            if (result.length === 1) {
                return [result, resultDetail];
            } else {
                return [];
            }
            // let [result, field] = await connection.execute(" SELECT *  FROM phieuchi right JOIN chitietphieuchi on phieuchi.idphieuchi = chitietphieuchi.idphieuchi WHERE phieuchi.idphieuchi = ?;", [id])
            // return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async FindAll() {
        try {
            let result = [];
            let [resultQuery, field] = await connection.execute("SELECT idphieuchi FROM phieuchi ORDER BY ngaygio DESC");
            for (let i = 0; i < resultQuery.length; i++) {
                let resultPayment = await new PaymentService().FindOneById(resultQuery[i].idphieuchi);
                result[i] = resultPayment;
            }
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Create(PaymentNew) {
        let idphieuchi = 0;
        try {
            let { idStaff, idSupplier, time, status, idGoods, quantity, price } = PaymentNew;
            await connection.execute("INSERT INTO `phieuchi`(`idnhanvien`, `idnhacungcap`, `ngaygio`,  `trangthai`) VALUES (?,?,?,?)", [idStaff, idSupplier, time, status]);

            let [result, field] = await connection.execute("SELECT * FROM phieuchi ORDER BY idphieuchi DESC LIMIT 1;");
            idphieuchi = result[0].idphieuchi;
            for (let i = 0; i < idGoods.length; i++) {
                await connection.execute("INSERT INTO `chitietphieuchi`(`idphieuchi`, `idhanghoa`, `soluong`, `dongia`) VALUES (?,?,?,?)", [result[0].idphieuchi, idGoods[i], quantity[i], price[i]]);
            }

            let payment = await new PaymentService().FindOneById(result[0].idphieuchi);
            return payment;
        } catch (e) {
            await connection.execute("DELETE FROM phieuchi WHERE idphieuchi = ? ", [idphieuchi]);
            console.log(e);
            return [];
        }
    }

    async Update(idPayment, updatePayment) {
        try {
            let { idStaff, idSupplier, time, idGoods, quantity, price } = updatePayment;
            await connection.execute("UPDATE `phieuchi` SET `idnhanvien`= ?,`idnhacungcap`= ?,`ngaygio`= ? WHERE idphieuchi = ?", [idStaff, idSupplier, time, idPayment]);

            for (let i = 0; i < idGoods.length; i++) {
                await connection.execute("DELETE FROM `chitietphieuchi`WHERE idphieuchi = ?", [idPayment]);
            }
            for (let i = 0; i < idGoods.length; i++) {
                await connection.execute("INSERT INTO `chitietphieuchi`(`idphieuchi`, `idhanghoa`, `soluong`, `dongia`) VALUES (?,?,?,?)", [idPayment, idGoods[i], quantity[i], price[i]]);
            }

            let result = await new PaymentService().FindOneById(idPayment);
            return result;

        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Delete(idPayment) {
        try {
            await connection.execute("DELETE FROM `chitietphieuchi` WHERE idphieuchi = ?", [idPayment]);
            await connection.execute("DELETE FROM `phieuchi` WHERE idphieuchi = ?", [idPayment])
            let result = await new PaymentService().FindOneById(idPayment);
            if (result.length === 0) {
                return idPayment;
            }
        } catch (e) {
            console.log(e);
            return 0;
        }
    }
}

export default new PaymentService();
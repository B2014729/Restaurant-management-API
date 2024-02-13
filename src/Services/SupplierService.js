import connection from "../Configs/ConnectDB.js";

class SupplierService {
    async FindOneById(id) {
        try {
            let [result, field] = await connection.execute("SELECT * FROM nhacungcap WHERE idnhacungcap = ?", [id]);
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async FindAll() {
        try {
            let [result, field] = await connection.execute("SELECT * FROM nhacungcap WHERE trangthai = 1");
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Create(newSupplier) {
        try {
            let { name, address, phone, bank, bankName } = newSupplier;
            await connection.execute("INSERT INTO `nhacungcap`(`tennhacungcap`, `diachi`, `sodienthoai`, `sotaikhoan`, `nganhang`, `trangthai`) VALUES (?,?,?,?,?,1)", [name, address, phone, bank, bankName])
            let [result, field] = await connection.execute("SELECT * FROM nhacungcap ORDER BY idnhacungcap DESC LIMIT 1;");
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Update(idSupplier, updateSupplier) {
        try {
            let { name, address, phone, bank, bankName } = updateSupplier;
            let [update, field] = await connection.execute("UPDATE `nhacungcap` SET `tennhacungcap`= ?,`diachi`= ?,`sodienthoai`= ?,`sotaikhoan`= ?, `nganhang` = ? WHERE idnhacungcap = ?", [name, address, phone, bank, bankName, idSupplier])
            if (update.changedRows !== 0) {
                let [result, field] = await new SupplierService().FindOneById(idSupplier);
                return result;
            }
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Delete(idSupplier) {
        try {
            await connection.execute("UPDATE `nhacungcap` SET `trangthai` = 0 WHERE idnhacungcap = ?", [idSupplier])
            let result = await new SupplierService().FindOneById(idSupplier);
            if (result[0].trangthai == 0) {
                return idSupplier;
            }
        } catch (e) {
            console.log(e);
            return 0;
        }
    }
}

export default new SupplierService();
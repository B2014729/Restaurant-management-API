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
            let [result, field] = await connection.execute("SELECT * FROM nhacungcap");
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Create(newSupplier) {
        try {
            let { name, address, phone, bank } = newSupplier;
            await connection.execute("INSERT INTO `nhacungcap`(`tennhacungcap`, `diachi`, `sodienthoai`, `sotaikhoan`) VALUES (?,?,?,?)", [name, address, phone, bank])
            let [result, field] = await connection.execute("SELECT * FROM nhacungcap ORDER BY idnhacungcap DESC LIMIT 1;");
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Update(idSupplier, updateSupplier) {
        try {
            let { name, address, phone, bank } = updateSupplier;
            let [update, field] = await connection.execute("UPDATE `nhacungcap` SET `tennhacungcap`= ?,`diachi`= ?,`sodienthoai`= ?,`sotaikhoan`= ? WHERE idnhacungcap = ?", [name, address, phone, bank, idSupplier])
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
            await connection.execute("DELETE FROM `nhacungcap` WHERE idnhacungcap = ?", [idSupplier])
            let result = await new SupplierService().FindOneById(idSupplier);
            if (result.length === 0) {
                return idSupplier;
            }
        } catch (e) {
            console.log(e);
            return 0;
        }
    }
}

export default new SupplierService();
import connection from "../Configs/ConnectDB.js";

class CustomerService {
    async FindOneById(id) {
        try {
            let [result, field] = await connection.execute("SELECT * FROM khachhang WHERE idkhachhang = ?", [id]);
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async FindAll() {
        try {
            let [result, field] = await connection.execute("SELECT * FROM khachhang");
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Create(customerNew) {
        try {
            let { phone, username, password } = customerNew;
            await connection.execute("INSERT INTO `khachhang`(`sodienthoai`, `tendangnhap`, `matkhau`) VALUES (?,?,?)", [phone, username, password])
            let [result, field] = await connection.execute("SELECT * FROM khachhang ORDER BY idkhachhang DESC LIMIT 1;");
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Update(idCustomer, updateCustomer) {
        try {
            let { phone, username, password } = updateCustomer;
            let [update, field] = await connection.execute("UPDATE `khachhang` SET `sodienthoai`= ?,`tendangnhap`= ?,`matkhau`= ? WHERE idkhachhang = ?", [phone, username, password, idCustomer])
            if (update.changedRows !== 0) {
                let [result, field] = await new CustomerService().FindOneById(idCustomer);
                return result;
            }
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Delete(idCustomer) {
        try {
            await connection.execute("DELETE FROM `khachhang` WHERE idkhachhang = ?", [idCustomer])
            let result = await new CustomerService().FindOneById(idCustomer);
            if (result.length === 0) {
                return idCustomer;
            }
        } catch (e) {
            console.log(e);
            return 0;
        }
    }

    async GetQuantityOrderTable(idCustomer) {
        try {
            let [result, field] = await connection.execute("SELECT COUNT(idkhachhang) soluong, idkhachhang FROM `datban` WHERE idkhachhang = ?", [idCustomer]);
            if (result.length > 0) {
                return result;
            }
            return [{
                idkhachhang: idCustomer,
                soluong: 0
            }];
        } catch (error) {
            console.log(error);
            return [{
                idkhachhang: idCustomer,
                soluong: 0
            }];
        }
    }

    async GetDetailOrderTable(idCustomer) {
        try {
            let [result, field] = await connection.execute("SELECT * FROM `datban` WHERE idkhachhang = ?", [idCustomer]);
            if (result.length > 0) {
                return result;
            }
            return [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async FindAllEvalues() {
        try {
            let [result, field] = await connection.execute("SELECT * FROM danhgia ORDER BY `danhgia`.`thoigian` DESC");
            if (result.length > 0) {
                return result;
            }
            return [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }
}

export default new CustomerService();
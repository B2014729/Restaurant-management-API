import connection from "../Configs/ConnectDB.js";

class BookingsService {
    async FindOneById(id) {
        try {
            let [result, field] = await connection.execute("SELECT * FROM datban WHERE iddatban = ?", [id]);
            if (result.length > 0)
                return result;
            return [];
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async FindAll() {
        try {
            let [result, field] = await connection.execute("SELECT * FROM datban ORDER BY ngaygio ASC");
            if (result.length > 0)
                return result;
            return [];
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Create(dishNew) {
        try {
            let { idCustomer, quantityUser, dateTime, phone, name, note } = dishNew;

            await connection.execute("INSERT INTO `datban`(`idkhachhang`, `soluongnguoi`, `ngaygio`, trangthai, ghichu) VALUES (?,?,?,0,?)", [idCustomer, quantityUser, dateTime, note]);
            await connection.execute("UPDATE khachhang SET hotenkhachhang = ?, sodienthoai = ? WHERE idkhachhang = ?", [name, phone, idCustomer]);
            let [result, field] = await connection.execute("SELECT * FROM datban ORDER BY iddatban DESC LIMIT 1;");
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Update(idBookings, updateBookings) {
        try {
            let { idCustomer, quantityUser, dateTime, status } = updateBookings;
            let [update, field] = await connection.execute("UPDATE `datban` SET `idkhachhang`= ?,`soluongnguoi`= ?,`ngaygio`= ?, trangthai = ? WHERE iddatban = ?", [idCustomer, quantityUser, dateTime, status, idBookings])
            if (update.changedRows !== 0) {
                let [result, field] = await new BookingsService().FindOneById(idBookings);
                return result;
            }
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Confirm(idBookings) {
        try {
            let [update, field] = await connection.execute("UPDATE `datban` SET trangthai = ? WHERE iddatban = ?", [1, idBookings])
            if (update.changedRows !== 0) {
                let [result, field] = await new BookingsService().FindOneById(idBookings);
                return result;
            }
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Delete(idBookings) {
        try {
            await connection.execute("DELETE FROM `datban` WHERE iddatban = ?", [idBookings])
            let result = await new BookingsService().FindOneById(idBookings);
            if (result.length === 0) {
                return idBookings;
            }
        } catch (e) {
            console.log(e);
            return 0;
        }
    }

    async FindAllWithIdCustomer(id) {
        try {
            let [result, field] = await connection.execute("SELECT * FROM datban WHERE idkhachhang = ?", [id]);
            if (result.length > 0)
                return result;
            return [];
        } catch (e) {
            console.log(e);
            return [];
        }
    }
}

export default new BookingsService();
import connection from "../Configs/ConnectDB.js";

class BookingsService {
    async FindOneById(id) {
        try {
            let [result, field] = await connection.execute("SELECT * FROM datban WHERE iddatban = ?", [id]);
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async FindAll() {
        try {
            let [result, field] = await connection.execute("SELECT * FROM datban ORDER BY ngaygio");
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Create(dishNew) {
        try {
            let { idCustomer, quantityUser, dateTime, status } = dishNew;

            await connection.execute("INSERT INTO `datban`(`idkhachhang`, `soluongnguoi`, `ngaygio`, trangthai) VALUES (?,?,?,?)", [idCustomer, quantityUser, dateTime, status])
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
}

export default new BookingsService();
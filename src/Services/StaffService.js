import connection from "../Configs/ConnectDB.js";
class StaffService {
    async FindOneById(id) {
        try {
            let [result, field] = await connection.execute("SELECT * FROM nhanvien WHERE idnhanvien = ?", [id]);
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async FindAll() {
        try {
            let [result, field] = await connection.execute("SELECT * FROM nhanvien");
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Create(staff) {
        try {
            let { fullname, dateofbirth, gender, idnumber, address, phone, idposition } = staff;
            await connection.execute("INSERT INTO `nhanvien`(`hoten`, `ngaysinh`, `gioitinh`, `cccd`, `diachi`, `sodienthoai`, `idchucvu`) VALUES (?,?,?,?,?,?,?)", [fullname, dateofbirth, gender, idnumber, address, phone, idposition])
            let [result, field] = await connection.execute("SELECT * FROM nhanvien ORDER BY idnhanvien DESC LIMIT 1;");
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Update(id, staff) {
        try {
            let { fullname, dateofbirth, gender, idnumber, address, phone, idposition } = staff;
            let [update, field] = await connection.execute("UPDATE `nhanvien` SET `hoten`= ?,`ngaysinh`= ?,`gioitinh`= ?,`cccd`= ?,`diachi`= ?,`sodienthoai`= ?,`idchucvu`= ? WHERE idnhanvien = ?", [fullname, dateofbirth, gender, idnumber, address, phone, idposition, id])
            if (update.changedRows !== 0) {
                let [result, field] = await new StaffService().FindOneById(id);
                return result;
            }
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Delete(id) {
        try {
            await connection.execute("DELETE FROM `nhanvien` WHERE idnhanvien = ?", [id])
            let result = await new StaffService().FindOneById(id);
            if (result.length === 0) {
                return id;
            }
        } catch (e) {
            console.log(e);
            return 0;
        }
    }

}

export default new StaffService();
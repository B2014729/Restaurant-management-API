import connection from "../Configs/ConnectDB.js";
class StaffService {
    async FindOneById(id) {
        try {
            let [result, field] = await connection.execute("SELECT nhanvien.*, chucvu.tenchucvu FROM nhanvien LEFT JOIN chucvu ON nhanvien.idchucvu = chucvu.idchucvu WHERE idnhanvien = ?", [id]);
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async FindAll() {
        try {
            let [result, field] = await connection.execute("SELECT nhanvien.*, chucvu.tenchucvu FROM nhanvien LEFT JOIN chucvu ON nhanvien.idchucvu = chucvu.idchucvu");
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Create(staff) {
        try {
            let { fullname, dateofbirth, gender, idnumber, address, phone, idposition, status, idsalary, datestart } = staff;
            await connection.execute("INSERT INTO `nhanvien`(`hoten`, `ngaysinh`, `gioitinh`, `cccd`, `diachi`, `sodienthoai`, `idchucvu`, `ngaythamgia`, `trangthai`, `idluong` ) VALUES (?,?,?,?,?,?,?,?,?,?)",
                [fullname, dateofbirth, gender, idnumber, address, phone, idposition, datestart, status, idsalary])
            let [result, field] = await connection.execute("SELECT * FROM nhanvien ORDER BY idnhanvien DESC LIMIT 1;");
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Update(id, staff) {
        try {
            let { fullname, dateofbirth, gender, idnumber, address, phone, idposition, status, datestart, idsalary } = staff;
            let [update, field] = await connection.execute("UPDATE `nhanvien` SET `hoten`= ?,`ngaysinh`= ?,`gioitinh`= ?,`cccd`= ?,`diachi`= ?,`sodienthoai`= ?,`idchucvu`= ?, `ngaythamgia`= ?, `trangthai`= ?, `idluong`= ? WHERE idnhanvien = ?",
                [fullname, dateofbirth, gender, idnumber, address, phone, idposition, datestart, status, idsalary, id])
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

    async UploadAvatar(id, url) {
        try {
            let [update, field] = await connection.execute("UPDATE `nhanvien` SET `hinhanh`= ? WHERE idnhanvien = ?", [url, id]);
            if (update.changedRows !== 0) {
                let [result, field] = await new StaffService().FindOneById(id);
                return result;
            }
        } catch (e) {
            console.log(e);
            return [];
        }
    }

}

export default new StaffService();
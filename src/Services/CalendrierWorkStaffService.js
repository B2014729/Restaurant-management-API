import connection from "../Configs/ConnectDB.js";

class CalendriedWorkStaffService {
    async GetCalendrierWorkWithPlase(idPhase) {
        try {
            let [result, field] = await connection.execute("SELECT * FROM chittietlamviec LEFT JOIN lichlamviec ON lichlamviec.idlichlamviec = chittietlamviec.idlichlamviec WHERE lichlamviec.giaidoan = ? ORDER BY chittietlamviec.idnhanvien;", [idPhase]);
            if (result.length > 0) {
                return result;
            }
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async GetCalendrierWorkWithId(idCalendrier) {
        try {
            let [result, field] = await connection.execute("SELECT * FROM chittietlamviec  WHERE idlichlamviec = ? ORDER BY chittietlamviec.idnhanvien;", [idCalendrier]);
            if (result.length > 0) {
                return result;
            }
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async GetCalendrierArrangeWithPlase(idPhase) {
        try {
            let [result, field] = await connection.execute("SELECT * FROM dangkilamviec LEFT JOIN lichlamviec ON lichlamviec.idlichlamviec = dangkilamviec.idlichlamviec WHERE lichlamviec.giaidoan = ? ORDER BY dangkilamviec.idnhanvien;", [idPhase]);
            if (result.length > 0) {
                return result;
            }
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async CreateNewDetailWorkCalendrier(data) {//tao lich lam cho nhan vien
        let { idlichlamviec, idnhanvien, ngay1, ngay2, ngay3, ngay4, ngay5, ngay6, ngay7, } = data;
        try {
            let result = await connection.execute("INSERT INTO `chittietlamviec`(`idlichlamviec`, `idnhanvien`, `ngay1`, `ngay2`, `ngay3`, `ngay4`, `ngay5`, `ngay6`, `ngay7`) VALUES (?,?,?,?,?,?,?,?,?)", [idlichlamviec, idnhanvien, ngay1, ngay2, ngay3, ngay4, ngay5, ngay6, ngay7,]);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async CreateRegisterWorkStaff(data) {//nhan vien dang ki lich lam moi
        let { idlichlamviec, idnhanvien, ngay1, ngay2, ngay3, ngay4, ngay5, ngay6, ngay7, } = data;
        try {
            let result = await connection.execute("INSERT INTO `dangkilamviec`(`idlichlamviec`, `idnhanvien`, `ngay1`, `ngay2`, `ngay3`, `ngay4`, `ngay5`, `ngay6`, `ngay7`) VALUES (?,?,?,?,?,?,?,?,?)", [idlichlamviec, idnhanvien, ngay1, ngay2, ngay3, ngay4, ngay5, ngay6, ngay7,]);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async GetAllPhase() { //Lay tat ca cac giai doan hien  co
        try {
            let [result, field] = await connection.execute("SELECT * FROM giaidoan");
            if (result.length > 0) {
                return result;
            }
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async CreateNewPhase(start, end) {//Tao 1 giai doan moi
        let ms1 = (new Date(start)).getTime();
        let ms2 = (new Date(end)).getTime();
        let quantityDay = Math.ceil((ms2 - ms1) / (24 * 60 * 60 * 1000));

        try {
            await connection.execute("INSERT INTO `giaidoan`(`songay`, `ngaybatdau`, `ngayketthuc`) VALUES (?,?,?)", [quantityDay, start, end]);
            let [result, field] = await connection.execute("SELECT * FROM giaidoan ORDER BY idgiaidoan DESC LIMIT 1;");
            return result;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async CreateNewCalendrier(idPhase, quantityDay) {//  Tao tuan moi => tao lich lm viec moi
        let lengthWeek = quantityDay / 7;
        try {
            for (let index = 0; index < lengthWeek; index++) {
                await connection.execute("INSERT INTO `lichlamviec`( `giaidoan`, `tuan`) VALUES (?,?)", [idPhase, index + 1]);
            }
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async GetCalendrierOfStaff(idStaff, idPhase) { //Lay thong tin lich lam  viec cua 1 nhan  vien tai 1 thoi diem
        try {
            let [result, field] = await connection.execute("SELECT * FROM chittietlamviec LEFT JOIN lichlamviec ON lichlamviec.idlichlamviec = chittietlamviec.idlichlamviec WHERE lichlamviec.giaidoan = ? AND chittietlamviec.idnhanvien = ?;", [idPhase, idStaff]);
            if (result.length > 0) {
                return result;
            }
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async GetListIdCalendrierWithPhase(id) {
        try {
            let [result, field] = await connection.execute("SELECT idlichlamviec FROM lichlamviec WHERE giaidoan = ?;", [id]);
            if (result.length > 0) {
                return result;
            }
        } catch (error) {
            console.log(error);
            return [];
        }
    } s
}

export default new CalendriedWorkStaffService();

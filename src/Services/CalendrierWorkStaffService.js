import connection from "../Configs/ConnectDB.js";

class CalendriedWorkStaffService {
    async GetCalendriedWorkWithPlase(idPhase) {
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

    async GetAllPhase() {
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

    async GetCalendriedOfStaff(idStaff, idPhase) {
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
}

export default new CalendriedWorkStaffService();

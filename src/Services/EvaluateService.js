import connection from "../Configs/ConnectDB.js";

class EvaluateService {
    async FindOneById(id) {
        try {
            let [result, field] = await connection.execute("SELECT * FROM danhgia LEFT JOIN khachhang ON danhgia.idkhachhang = khachhang.idkhachhang WHERE iddanhgia = ?", [id]);
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
            let [result, field] = await connection.execute("SELECT * FROM danhgia LEFT JOIN khachhang ON danhgia.idkhachhang = khachhang.idkhachhang");
            if (result.length > 0)
                return result;
            return [];
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Create(data) {
        let { idkhachhang, sosao, noidung, thoigian } = data;
        try {
            await connection.execute("INSERT INTO `danhgia`(`idkhachhang`, `sosao`, `noidung`, `thoigian`) VALUES (?,?,?,?)", [idkhachhang, sosao, noidung, thoigian])
            let [result, field] = await connection.execute("SELECT * FROM danhgia LEFT JOIN khachhang ON danhgia.idkhachhang = khachhang.idkhachhang ORDER BY iddanhgia DESC LIMIT 1;");
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Update(idEvaluate, dataUpdate) {
        let { sosao, thoigian, noidung, } = dataUpdate;
        try {
            let [evaluateExist, fieldTable] = await new EvaluateService().FindOneById(idtable);
            if (evaluateExist) {// evaluateExist => object is not array????
                await connection.execute("UPDATE `danhgia` SET `sosao`='?',`noidung`='?',`thoigian`='?' WHERE iddanhgia = ?", [sosao, noidung, thoigian, idEvaluate]);
            }
            let [result, field] = await new EvaluateService().FindOneById(idtable);
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Delete(idEvaluate) {
        try {
            await connection.execute("DELETE FROM `danhgia` WHERE iddanhgia = ?", [idEvaluate])
            let result = await new EvaluateService().FindOneById(idEvaluate);
            if (result.length === 0) {
                return idEvaluate;
            }
        } catch (e) {
            console.log(e);
            return 0;
        }
    }
}

export default new EvaluateService();
import connection from "../Configs/ConnectDB.js";

class UnitService {
    async FindOneById(id) {
        try {
            let [result, field] = await connection.execute("SELECT * FROM donvitinh WHERE iddonvitinh = ?", [id]);
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }
}

export default new UnitService();

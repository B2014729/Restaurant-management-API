import connection from "../Configs/ConnectDB.js";

class TableService {
    async FindOneById(id) {
        try {
            let [result, field] = await connection.execute("SELECT * FROM ban WHERE idban = ?", [id]);
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async FindAll() {
        try {
            let [result, field] = await connection.execute("SELECT * FROM ban");
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Create() {
        try {
            await connection.execute("INSERT INTO `ban`(`trangthai`) VALUES (?)", [0])
            let [result, field] = await connection.execute("SELECT * FROM ban ORDER BY idban DESC LIMIT 1;");
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Update(idtable) {
        try {
            let [tableExist, fieldTable] = await new TableService().FindOneById(idtable);
            if (tableExist) {// tableExist => object is not array????
                if (tableExist.trangthai === 0) {
                    await connection.execute("UPDATE `ban` SET `trangthai`= '1' WHERE idban = ?", [idtable]);
                } else {
                    await connection.execute("UPDATE `ban` SET `trangthai`= '0'WHERE idban = ?", [idtable]);
                }
            }
            let [result, field] = await new TableService().FindOneById(idtable);
            return result;

        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Delete(idTable) {
        try {
            await connection.execute("DELETE FROM `ban` WHERE idban = ?", [idTable])
            let result = await new TableService().FindOneById(idTable);
            if (result.length === 0) {
                return idTable;
            }
        } catch (e) {
            console.log(e);
            return 0;
        }
    }
}

export default new TableService();
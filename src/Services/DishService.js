import connection from "../Configs/ConnectDB.js";

class DishService {
    async FindOneById(id) {
        try {
            let [result, field] = await connection.execute("SELECT * FROM mon WHERE idmon = ?", [id]);
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async FindAll() {
        try {
            let [result, field] = await connection.execute("SELECT * FROM mon");
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Create(dishNew) {
        try {
            let { name, price, imageUrl, unit, type } = dishNew;
            await connection.execute("INSERT INTO `mon`(`tenmon`, `gia`, `hinhanh`, iddonvitinh, idloai) VALUES (?,?,?,?,?)", [name, price, imageUrl, unit, type])
            let [result, field] = await connection.execute("SELECT * FROM mon ORDER BY idmon DESC LIMIT 1;");
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Update(idDish, updateDish) {
        try {
            let { name, price, imageUrl, unit, type } = updateDish;
            let [update, field] = await connection.execute("UPDATE `mon` SET `tenmon`= ?,`gia`= ?,`hinhanh`= ?, iddonvitinh = ?, idloai = ? WHERE idmon = ?", [name, price, imageUrl, unit, type, idDish])
            if (update.changedRows !== 0) {
                let [result, field] = await new DishService().FindOneById(idDish);
                return result;
            }
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Delete(idDish) {
        try {
            await connection.execute("DELETE FROM `mon` WHERE idmon = ?", [idDish])
            let result = await new DishService().FindOneById(idDish);
            if (result.length === 0) {
                return idDish;
            }
        } catch (e) {
            console.log(e);
            return 0;
        }
    }
}

export default new DishService();
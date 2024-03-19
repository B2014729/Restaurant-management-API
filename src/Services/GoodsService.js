import connection from "../Configs/ConnectDB.js";

class GoodsService {
    async FindOneById(id) {
        try {
            let [result, field] = await connection.execute("SELECT * FROM hanghoa WHERE idhanghoa = ?", [id]);
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async FindAll() {
        try {
            let [result, field] = await connection.execute("SELECT * FROM hanghoa");
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Create(goodsNew) {
        try {
            let { name, dateManufacture, expiry, imageUrl, description, type, unit } = goodsNew;
            await connection.execute("INSERT INTO `hanghoa`(`tenhanghoa`, `ngaysanxuat`, `hansudung`, hinhanh, mota, idloai, iddonvitinh) VALUES (?,?,?,?,?,?,?)", [name, dateManufacture, expiry, imageUrl, description, type, unit])
            let [result, field] = await connection.execute("SELECT * FROM hanghoa ORDER BY idhanghoa DESC LIMIT 1;");
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Update(idGoods, updateGoods) {
        try {
            let { name, dateManufacture, expiry, imageUrl, description, type, unit } = updateGoods;
            let [update, field] = await connection.execute("UPDATE `hanghoa` SET `tenhanghoa`= ?,`ngaysanxuat`= ?,`hansudung`= ?, hinhanh = ?, mota = ?, idloai = ?, iddonvitinh = ? WHERE idhanghoa = ?", [name, dateManufacture, expiry, imageUrl, description, type, unit, idGoods])
            if (update.changedRows !== 0) {
                let [result, field] = await new GoodsService().FindOneById(idGoods);
                return result;
            }
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async UpdateDateManufacture(idGoods, date) {
        try {
            let [update, field] = await connection.execute("UPDATE `hanghoa` SET `ngaysanxuat`= ? WHERE idhanghoa = ?", [date, idGoods])
            if (update.changedRows !== 0) {
                let [result, field] = await new GoodsService().FindOneById(idGoods);
                return result;
            }
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Delete(idGoods) {
        try {
            await connection.execute("DELETE FROM `hanghoa` WHERE idhanghoa = ?", [idGoods])
            let result = await new GoodsService().FindOneById(idGoods);
            if (result.length === 0) {
                return idGoods;
            }
        } catch (e) {
            console.log(e);
            return 0;
        }
    }
}

export default new GoodsService();
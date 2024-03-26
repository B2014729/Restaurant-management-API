import connection from "../Configs/ConnectDB.js";

class DishService {
    async GetAllDishType() {
        try {
            let [result, field] = await connection.execute("SELECT * FROM loai");
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async FindOneById(id) {
        try {
            let [result, field] = await connection.execute("SELECT * FROM mon  LEFT JOIN loai ON mon.idloai  = loai.idloai WHERE idmon = ?", [id]);
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async FindAll() {
        try {
            let [result, field] = await connection.execute("SELECT * FROM mon WHERE trangthai = 1;");
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async FindAllWithType(idType) {
        try {
            let [result, field] = await connection.execute("SELECT mon.* FROM mon LEFT JOIN loai ON mon.idloai = loai.idloai WHERE mon.trangthai = 1 AND mon.idloai = ?", [idType]);
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Create(dishNew) {
        try {
            let { name, price, imageUrl, unit, type } = dishNew;
            await connection.execute("INSERT INTO `mon`(`tenmon`, `gia`, `hinhanh`, iddonvitinh, idloai, trangthai) VALUES (?,?,?,?,?, 1)", [name, price, '', unit, type])
            let [result, field] = await connection.execute("SELECT * FROM mon ORDER BY idmon DESC LIMIT 1;");
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Update(idDish, updateDish) {
        try {
            let { name, price, unit, type, status } = updateDish;
            let [update, field] = await connection.execute("UPDATE `mon` SET `tenmon`= ?,`gia`= ?, iddonvitinh = ?, idloai = ?, trangthai = ? WHERE idmon = ?", [name, price, unit, type, status, idDish])
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
            let [update, field] = await connection.execute("UPDATE `mon` SET trangthai = 0 WHERE idmon = ?", [idDish])
            if (update.changedRows !== 0) {
                let [result, field] = await new DishService().FindOneById(idDish);
                return [result];
            } else {
                return [];
            }
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async GetMenu(idType) {
        try {
            let [result, field] = await connection.execute("SELECT mon.* FROM mon, menu, loai WHERE menu.idmon = mon.idmon AND mon.idloai = loai.idloai AND mon.trangthai = 1 AND mon.idloai = ?", [idType]);
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async DeleteOutMenu(idDish) {
        try {
            await connection.execute("DELETE FROM menu WHERE idmon = ?", [idDish]);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async AddDishOnMenu(idDish) {
        try {
            await connection.execute("INSERT INTO `menu`(`idmon`) VALUES (?)", [idDish]);
            let [result, field] = await connection.execute("SELECT * FROM menu ORDER BY idmenu DESC LIMIT 1;");
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async GetDishSellALot() {
        try {
            let [result, field] = await connection.execute("SELECT chitietdatmon.idmon, SUM(chitietdatmon.soluong) soluong FROM `chitietdatmon`  GROUP BY chitietdatmon.idmon ORDER BY `soluong` DESC");
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async GetAllDishType() {
        try {
            let [result, field] = await connection.execute("SELECT * FROM `loai`");
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async StatisticalOnDishSell() {
        try {
            let [result, field] = await connection.execute("SELECT idmon, SUM(soluong) soluong FROM `chitietdatmon` GROUP BY idmon;");
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }
}

export default new DishService();
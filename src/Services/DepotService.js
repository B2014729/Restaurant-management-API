import connection from "../Configs/ConnectDB.js";

class DepotService {
    //Tim san pham trong kho
    async FindOneById(id) {
        try {
            let [result, field] = await connection.execute("SELECT * FROM kho WHERE idhanghoa = ?", [id]);
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async FindAll() {
        try {
            let [result, field] = await connection.execute("SELECT * FROM kho");
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Create(goodsNew) {
        try {
            let { idGoods, quantity, date } = goodsNew;
            let goodsIsDepot = await new DepotService().FindOneById(idGoods);

            if (goodsIsDepot.length > 0) {
                await connection.execute("UPDATE `kho` SET `soluong` = ?, `ngaynhap` = ?", [(goodsIsDepot[0].soluong + quantity), date]);
            } else {
                await connection.execute("INSERT INTO `kho`(`idhanghoa`, `soluong`, `ngaynhap`) VALUES (?,?,?)", [idGoods, quantity, date])
            }
            let [result, field] = await connection.execute("SELECT * FROM kho WHERE idhanghoa = ?", [idGoods]);
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Delete(idGoods) {
        try {
            await connection.execute("DELETE FROM `kho` WHERE idhanhoa = ?", [idGoods])
            let result = await new DepotService().FindOneById(idGoods);
            if (result.length === 0) {
                return idGoods;
            }
        } catch (e) {
            console.log(e);
            return 0;
        }
    }

    async Update(idGoods, quantity) {
        try {
            let [update, field] = await connection.execute("UPDATE `kho` SET  soluong = ? WHERE idhanghoa = ?", [quantity, idGoods]);
            if (update.changedRows !== 0) {
                let [result, field] = await new DepotService().FindOneById(idGoods);
                return result;
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export default new DepotService();
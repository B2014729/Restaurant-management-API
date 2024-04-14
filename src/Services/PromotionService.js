import connection from "../Configs/ConnectDB.js";

class PromotionService {
    async FindOneById(id) { // Lay hoa don theo idhoadon
        try {
            let [result, field] = await connection.execute("SELECT * FROM combo_khuyenmai WHERE idkhuyenmai = ?", [id]);
            let [resultDetail, fieldDetail] = await connection.execute("SELECT * FROM chitietkhuyenmai WHERE idkhuyenmai = ?", [id]);
            if (result.length === 1) {
                return [result, resultDetail];
            } else {
                return [];
            }
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async FindAll() { // lay tat ca cac hoa don
        try {
            let result = [];
            let [resultQuery, field] = await connection.execute("SELECT idkhuyenmai FROM combo_khuyenmai");
            for (let i = 0; i < resultQuery.length; i++) {
                let resultPromotion = await new PromotionService().FindOneById(resultQuery[i].idkhuyenmai);
                result[i] = resultPromotion;
            }
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }


    // async FindAllWhereTime(start, end) { // Lay cac hoa don trong giai doan start => end
    //     try {
    //         let result = [];
    //         let [resultQuery, field] = await connection.execute("SELECT idhoadon FROM hoadon WHERE ngaygioxuat >= ? AND ngaygioxuat <= ?", [start, end]);
    //         for (let i = 0; i < resultQuery.length; i++) {
    //             let resultBill = await new PromotionService
    //                 ().FindOneById(resultQuery[i].idhoadon);
    //             result[i] = resultBill;
    //         }
    //         return result;
    //     } catch (e) {
    //         console.log(e);
    //         return [];
    //     }
    // }

    // async FindAllInDate(date) {
    //     let start = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 00:00:00`;
    //     let end = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 23:59:00`;


    //     try {
    //         let result = [];
    //         let [resultQuery, field] = await connection.execute("SELECT idhoadon FROM hoadon WHERE ngaygiotao >= ? AND ngaygiotao <= ? ORDER BY ngaygiotao DESC", [start, end]);
    //         for (let i = 0; i < resultQuery.length; i++) {
    //             let resultBill = await new PromotionService
    //                 ().FindOneById(resultQuery[i].idhoadon);
    //             result[i] = resultBill;
    //         }
    //         return result;
    //     } catch (e) {
    //         console.log(e);
    //         return [];
    //     }
    // }


    async AddDetailPromotion(idPromotion, idDish, quantity) { // Them mot chi tiet hoa don
        try {
            await connection.execute("INSERT INTO `chitietkhuyenmai`(`idkhuyenmai`, `idmon`, `soluong`) VALUES (?,?,?)", [idPromotion, idDish, quantity]);
            let result = await new PromotionService().FindOneById(idPromotion);
            return result;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async DeleteDetailPromotion(idPromotion) {
        try {
            await connection.execute("DELETE FROM `chitietkhuyenmai` WHERE idkhuyenmai = ?", [idPromotion])
            let result = await new PromotionService().FindOneById(idPromotion);
            if (result[1].length == 0) {
                return idPromotion;
            }
            return -1;
        } catch (error) {
            console.log(error);
            return -1;
        }
    }

    async Create(newPromotion) {  // Tao mot hoa don moi
        // newPromotion = {
        //     name, image, dateStart, dateEnd, value,
        //     promotionDetail: [
        //         [listIdDish], [listQuantity]
        //     ],
        // }
        try {
            let { name, image, dateStart, dateEnd, value } = newPromotion;
            let status = 1; //Dang hoat dongt status = 1

            let { detailPromotion } = newPromotion;
            if (detailPromotion.length > 0) {
                let listDish = detailPromotion[0];
                let listQuantity = detailPromotion[1];

                await connection.execute("INSERT INTO `combo_khuyenmai`(`tenkhuyenmai`, `hinhanh`, `trangthai`, ngaybatdau, ngayketthuc, giatrikhuyenmai) VALUES (?,?,?,?,?,?)", [name, image, status, dateStart, dateEnd, value]);
                let [result, field] = await connection.execute("SELECT * FROM combo_khuyenmai ORDER BY idkhuyenmai DESC LIMIT 1;");

                let [promotion, detailPromotionQuery] = await new PromotionService().FindOneById(result[0].idkhuyenmai);

                if (promotion.length > 0) {
                    const idPromotion = promotion[0].idkhuyenmai;
                    for (let index = 0; index < listDish.length; index++) {
                        await new PromotionService().AddDetailPromotion(idPromotion, listDish[index], listQuantity[index]);
                    }
                }
            }
            return [newPromotion];
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Update(Promotion) {  // Tao mot hoa don moi
        try {
            let { idPromotion, name, image, status, dateStart, dateEnd, value } = Promotion;

            let { detailPromotion } = Promotion; //Array
            //console.log(name, image, status, dateStart, dateEnd, value, idPromotion, detailPromotion);
            if (detailPromotion.length > 0) {
                let listDish = detailPromotion[0];
                let listQuantity = detailPromotion[1];
                let [update, field] = await connection.execute("UPDATE combo_khuyenmai SET tenkhuyenmai = ?, hinhanh = ?, trangthai = ?, ngaybatdau = ?, ngayketthuc = ?, giatrikhuyenmai = ? WHERE idkhuyenmai = ?", [name, image, status, dateStart, dateEnd, value, idPromotion]);

                let idPromotionIsDelete = await new PromotionService().DeleteDetailPromotion(idPromotion);

                if (idPromotion == idPromotionIsDelete) {
                    for (let index = 0; index < listDish.length; index++) {
                        await new PromotionService().AddDetailPromotion(idPromotion, listDish[index], listQuantity[index]);
                    }
                }
                return [Promotion];
            }
            return [];
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    // async Update(idBill) {
    //     try {
    //         let { name, address, phone, bank } = updateSupplier;
    //         let [update, field] = await connection.execute("UPDATE `nhacungcap` SET `tennhacungcap`= ?,`diachi`= ?,`sodienthoai`= ?,`sotaikhoan`= ? WHERE idnhacungcap = ?", [name, address, phone, bank, idSupplier])
    //         if (update.changedRows !== 0) {
    //             let [result, field] = await new PromotionService().FindOneById(idSupplier);
    //             return result;
    //         }
    //     } catch (e) {
    //         console.log(e);
    //         return [];
    //     }
    // }



    async Delete(idPromotion) {
        try {
            let PromotionObject = new PromotionService();
            await PromotionObject.DeleteDetailPromotion(idPromotion);
            await connection.execute("DELETE FROM `combo_khuyenmai` WHERE idkhuyenmai = ?", [idPromotion])
            let result = await PromotionObject.FindOneById(idPromotion);

            if (result.length === 0) {
                return idPromotion;
            }
        } catch (e) {
            console.log(e);
            return 0;
        }
    }
}

export default new PromotionService();
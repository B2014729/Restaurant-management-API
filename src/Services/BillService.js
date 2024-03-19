import connection from "../Configs/ConnectDB.js";

class BillService {
    async FindOneById(id) { // Lay hoa don theo idhoadon
        try {
            let [result, field] = await connection.execute("SELECT * FROM hoadon WHERE idhoadon = ?", [id]);
            let [resultDetail, fieldDetail] = await connection.execute("SELECT * FROM chitiethoadon WHERE idhoadon = ?", [id]);
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

    // async FindOneByIdTable(idtable) {
    //     try {
    //         let [result, field] = await connection.execute("SELECT * FROM hoadon WHERE idban = ?", [idtable]);
    //         let [resultDetail, fieldDetail] = await connection.execute("SELECT * FROM chitiethoadon WHERE idhoadon = ?", [result[0].idhoadon]);
    //         if (result.length === 1) {
    //             return [result, resultDetail];
    //         } else {
    //             return [];
    //         }
    //     } catch (e) {
    //         console.log(e);
    //         return [];
    //     }
    // }

    async FindOneByIdTableNew(idTable) { // Lay thong tin hoa don cua ban dang an => trang thai thanh toan = 0 va gio xuat = null;
        try {
            let [result, field] = await connection.execute("SELECT * FROM `hoadon` WHERE idban = ? AND trangthai = 0 ORDER BY ngaygiotao DESC LIMIT 1", [idTable]);
            if (result.length > 0) {
                return result;
            } return [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async FindAllBillUnpaid() { // Lay danh sach thong tin hoa don cua ban dang an => trang thai thanh toan = 0 va gio xuat = null;
        try {
            let [result, field] = await connection.execute("SELECT * FROM `hoadon` WHERE  trangthai = 0 ORDER BY ngaygiotao DESC");
            if (result.length > 0) {
                return result;
            }
            return [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async FindAll() { // lay tat ca cac hoa don
        try {
            let result = [];
            let [resultQuery, field] = await connection.execute("SELECT idhoadon FROM hoadon");
            for (let i = 0; i < resultQuery.length; i++) {
                let resultBill = await new BillService().FindOneById(resultQuery[i].idhoadon);
                result[i] = resultBill;
            }
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async FindAllWithMonthAndYear(month, year) {
        try {
            let result = [];
            let [resultQuery, field] = await connection.execute("SELECT idhoadon FROM `hoadon` WHERE Month(ngaygioxuat) = ? AND YEAR(ngaygioxuat) = ?", [month, year]);
            for (let i = 0; i < resultQuery.length; i++) {
                let resultBill = await new BillService().FindOneById(resultQuery[i].idhoadon);
                result[i] = resultBill;
            }
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async FindBillPaid() { // lay cac hoa don da thanh toan
        try {
            let result = [];
            let [resultQuery, field] = await connection.execute("SELECT idhoadon FROM hoadon WHERE trangthai = 1");
            for (let i = 0; i < resultQuery.length; i++) {
                let resultBill = await new BillService().FindOneById(resultQuery[i].idhoadon);
                result[i] = resultBill;
            }
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }


    async FindAllWhereTime(start, end) { // Lay cac hoa don trong giai doan start => end
        try {
            let result = [];
            let [resultQuery, field] = await connection.execute("SELECT idhoadon FROM hoadon WHERE ngaygioxuat >= ? AND ngaygioxuat <= ?", [start, end]);
            for (let i = 0; i < resultQuery.length; i++) {
                let resultBill = await new BillService().FindOneById(resultQuery[i].idhoadon);
                result[i] = resultBill;
            }
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async FindAllInDate(date) {
        let start = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 00:00:00`;
        let end = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() + 1} 00:00:00`;
        try {
            let result = [];
            let [resultQuery, field] = await connection.execute("SELECT idhoadon FROM hoadon WHERE ngaygiotao >= ? AND ngaygiotao <= ?", [start, end]);
            for (let i = 0; i < resultQuery.length; i++) {
                let resultBill = await new BillService().FindOneById(resultQuery[i].idhoadon);
                result[i] = resultBill;
            }
            return result;
        } catch (e) {
            console.log(e);
            return [];
        }
    }


    async AddDetailBill(idBill, idOrderDish) { // Them mot chi tiet hoa don
        try {
            await connection.execute("INSERT INTO `chitiethoadon`(`idhoadon`, `iddatmon`) VALUES (?,?)", [idBill, idOrderDish]);
            let result = await new BillService().FindOneById(idBill);
            return result;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async Create(newBill) {  // Tao mot hoa don moi
        try {
            let { idStaff, idTable, timeCreate } = newBill;
            await connection.execute("INSERT INTO `hoadon`(`idnhanvien`, `idban`, `ngaygiotao`, ngaygioxuat, trangthai) VALUES (?,?,?,NULL,0)", [idStaff, idTable, timeCreate]);

            let [result, field] = await connection.execute("SELECT * FROM hoadon ORDER BY idhoadon DESC LIMIT 1;");

            let [bill, detailBill] = await new BillService().FindOneById(result[0].idhoadon);
            return bill;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async UpdateStatus(idBill, idStaff, timePrint) { // Cap nhat trang thai hoa don khi thanh toan => trangthai =1, ngaygioxuat != null
        try {
            let [update, field] = await connection.execute("UPDATE hoadon SET trangthai = 1, ngaygioxuat = ?, idnhanvien = ? WHERE idhoadon = ?", [timePrint, idStaff, idBill]);
            if (update.changedRows !== 0) {
                return await new BillService().FindOneById(idBill);
            }
            return [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    // async Update(idBill) {
    //     try {
    //         let { name, address, phone, bank } = updateSupplier;
    //         let [update, field] = await connection.execute("UPDATE `nhacungcap` SET `tennhacungcap`= ?,`diachi`= ?,`sodienthoai`= ?,`sotaikhoan`= ? WHERE idnhacungcap = ?", [name, address, phone, bank, idSupplier])
    //         if (update.changedRows !== 0) {
    //             let [result, field] = await new BillService().FindOneById(idSupplier);
    //             return result;
    //         }
    //     } catch (e) {
    //         console.log(e);
    //         return [];
    //     }
    // }



    // async Delete(idSupplier) {
    //     try {
    //         await connection.execute("DELETE FROM `nhacungcap` WHERE idnhacungcap = ?", [idSupplier])
    //         let result = await new BillService().FindOneById(idSupplier);
    //         if (result.length === 0) {
    //             return idSupplier;
    //         }
    //     } catch (e) {
    //         console.log(e);
    //         return 0;
    //     }
    // }
}

export default new BillService();
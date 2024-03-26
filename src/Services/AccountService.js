import e from "cors";
import connection from "../Configs/ConnectDB.js";
class AccountService {
    async FindOneById(id) {
        try {
            let [account, field] = await connection.execute("SELECT * FROM taikhoan WHERE idnhanvien = ?", [id]);
            if (account.length > 0) {
                return account;
            }
            return [];
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async FindAOneByUsername(username) {
        try {
            let [account, field] = await connection.execute("SELECT * FROM taikhoan WHERE tendangnhap = ?", [username]);
            if (account.length > 0) {
                return account;
            }
            return [];
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async Check(username, password) {
        try {
            let [account, field] = await connection.execute("SELECT * FROM taikhoan WHERE tendangnhap = ? AND matkhau = ?", [username, password]);
            if (account.length > 0) {
                return account;
            }
            return [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async CheckCustomer(username, password) {
        try {
            let [account, field] = await connection.execute("SELECT * FROM khachhang WHERE tendangnhap = ? AND matkhau = ?", [username, password]);
            if (account.length > 0) {
                return account;
            }
            return [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async Register(username, password) {
        try {
            await connection.execute("INSERT INTO `khachhang`(`tendangnhap`, `matkhau`) VALUES (?,?)", [username, password]);
            let [account, field] = await connection.execute("SELECT * FROM khachhang ORDER BY idkhachhang DESC LIMIT 1;");
            if (account.length > 0) {
                return account;
            }
            return [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    async Create(newAccount) {
        let { idAccount, username, password, role } = newAccount;
        try {
            await connection.execute("INSERT INTO `taikhoan`(`idnhanvien`, `tendangnhap`, `matkhau`, `quyen`) VALUES (?,?,?,?)", [idAccount, username, password, role]);
            let [account, field] = await connection.execute("SELECT * FROM taikhoan ORDER BY idnhanvien DESC LIMIT 1;");
            if (account.length > 0) {
                if (account[0].idnhanvien === idAccount) {
                    return account;
                }
                return [];
            }
            return [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async Update(idAccount, accountUpdate) {
        let { username, password, role } = accountUpdate;
        try {
            let [update, field] = await connection.execute("UPDATE `taikhoan` SET `tendangnhap`= ?,`matkhau`= ?,`quyen`= ? WHERE idnhanvien = ?", [username, password, role, idAccount]);
            if (update.changedRows !== 0) {
                let [account, field] = await new AccountService().FindOneById(idAccount);
                return account;
            }
            return [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async Delete(idAccount) {
        try {
            await connection.execute("DELETE FROM `taikhoan` WHERE idnhanvien = ?", [idAccount])
            let result = await new AccountService().FindOneById(idAccount);
            if (result.length === 0) {
                return idAccount;
            }
        } catch (e) {
            console.log(e);
            return 0;
        }
    }
}

export default new AccountService();
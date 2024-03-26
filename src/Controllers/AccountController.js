import AccountService from "../Services/AccountService.js";
import FormatResponseJson from "../Services/FotmatResponse.js";
import * as JWT from "../Services/JWTService.js";

// const test = () => {
//     let a = 101;
//     let x = a.toString()

//     let reverse = '';
//     for (let index = x.length - 1; index >= 0; index--) {
//         reverse += x[index];
//     }

//     console.log(typeof x);
//     if (x === reverse) {
//         console.log(true);
//         return
//     }
//     console.log(false);
// }

const Login = async (req, res) => {
    const { username, password } = req.body;
    if (!username && !password) {
        return res.status(400).json(FormatResponseJson(400, "Username and password is not empty!", []));
    }

    try {
        const account = await AccountService.Check(username, password);

        if (account.length > 0) {
            const token = JWT.tokenSign(account[0].idnhanvien);
            res.setHeader("Authorization", token);
            return res.status(200).json(FormatResponseJson(200, "Login successful!", [{
                tendangnhap: account[0].tendangnhap,
                quyen: account[0].quyen,
            }]));
        } else {
            const accountCustomer = await AccountService.CheckCustomer(username, password);

            if (accountCustomer.length > 0) {
                const token = JWT.tokenSign(accountCustomer[0].idkhachhang);
                res.setHeader("Authorization", token);
                return res.status(200).json(FormatResponseJson(200, "Login successful!", [{
                    tendangnhap: accountCustomer[0].tendangnhap,
                    quyen: 10,//Quyen danh dau khach hang
                }]));
            } else {
                return res.status(401).json(FormatResponseJson(401, "Login failed!", []));
            }
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

// const LoginCustomer = async (req, res) => {
//     const { username, password } = req.body;
//     if (!username && !password) {
//         return res.status(400).json(FormatResponseJson(400, "Username and password is not empty!", []));
//     }

//     try {
//         const account = await AccountService.CheckCustomer(username, password);

//         if (account.length > 0) {
//             const token = JWT.tokenSign(account[0].idkhachhang);
//             res.setHeader("Authorization", token);
//             return res.status(200).json(FormatResponseJson(200, "Login successful!", [{
//                 tendangnhap: account[0].tendangnhap,
//             }]));
//         } else {
//             return res.status(401).json(FormatResponseJson(401, "Login failed!", []));
//         }
//     } catch (e) {
//         console.log(e);
//         return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
//     }
// }

const UpdateAcountInfor = async (req, res) => {
    let idAccount = req.params.id;
    let { username, password } = req.body;

    if (!username && !password) {
        return res.status(400).json(FormatResponseJson(400, "Username and password is not empty!", []));
    }
    try {
        let account = await AccountService.FindOneById(idAccount);
        if (account.length === 0) {
            return res.status(400).json(FormatResponseJson(400, "Account is not exist!", []));
        }
        let updateAccount = {
            username: username,
            password: password,
            role: account[0].quyen
        }
        let accountUpdated = await AccountService.Update(idAccount, updateAccount);
        if (accountUpdated.length === 0) {
            return res.status(400).json(FormatResponseJson(400, "An error occurred while updating the account!", []));
        }
        return res.status(200).json(FormatResponseJson(200, "Updated successful account!", accountUpdated));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    };
}


const Register = async (req, res) => {
    let { username, password } = req.body;
    if (!username && !password) {
        return res.status(400).json(FormatResponseJson(400, "Username and password is not empty!", []));
    }
    try {
        let account = await AccountService.Register(username, password);

        if (account.length === 0) {
            return res.status(400).json(FormatResponseJson(400, "An error occurred while registing the account!", []));
        }
        return res.status(200).json(FormatResponseJson(200, "Register successful account!", account));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    };
}



export { Login, UpdateAcountInfor, Register };
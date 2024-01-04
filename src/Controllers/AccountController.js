import AccountService from "../Services/AccountService.js";
import FormatResponseJson from "../Services/FotmatResponse.js";

const Login = async (req, res) => {

}

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

export { Login, UpdateAcountInfor };
import StaffService from "../Services/StaffService.js";
import FormatResponseJson from "../Services/FotmatResponse.js";
import AccountService from "../Services/AccountService.js";


const GetStaff = async (req, res) => {
    let id = req.params.id;
    if (!id) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    } else {
        id = Number(id);
        if (isNaN(id)) {
            return res.status(404).json(FormatResponseJson(404, "Id is not Number", []));
        }
    }
    try {
        let staff = await StaffService.FindOneById(id);
        if (staff.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found staff id ${id}`, []));
        }
        return res.status(200).json(FormatResponseJson(200, "Successful", staff));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}

const GetStaffList = async (req, res) => {
    try {
        let staffList = await StaffService.FindAll();
        return res.status(200).json(FormatResponseJson(200, "Successful", staffList));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}


const NewStaff = async (req, res) => {
    let staffNew = req.body;
    if (!staffNew.fullname || !staffNew.dateofbirth || !staffNew.gender || !staffNew.idnumber ||
        !staffNew.address || !staffNew.phone || !staffNew.idposition) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }

    //Set account information
    let username = staffNew.fullname.substring(staffNew.fullname.indexOf(" "));
    username = username.replaceAll(" ", "");

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$&*';
    const charactersLength = characters.length;
    let password = "";
    for (let i = 0; i < 8; i++) {
        password += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    let role = 0;
    switch (Number(staffNew.idposition)) {
        case 3: //Quan li
            role = 5;
            break;
        case 1: //Thu ngan
            role = 1;
            break;
        case 5: //Bep truong
            role = 3;
            break;
        default:// Phuc vu, bep phu,...
            role = 0;
            break;
    }

    try {
        let result = await StaffService.Create(staffNew);
        if (result.length > 0) {
            let newAccount = {
                idAccount: result[0].idnhanvien,
                username: username,
                password: password,
                role: role
            };
            await AccountService.Create(newAccount);
            return res.status(200).json(FormatResponseJson(200, "Create staff successful!", result));
        }
        return res.status(401).json(FormatResponseJson(401, "Create staff failed!", []));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const UpdateStaff = async (req, res) => {
    let id = req.params.id;
    let staffUpdate = req.body;

    if (!id) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    } else {
        id = Number(id);
        if (isNaN(id)) {
            return res.status(404).json(FormatResponseJson(404, "Id is not Number", []));
        }
    }

    if (!staffUpdate.fullname || !staffUpdate.dateofbirth || !staffUpdate.gender || !staffUpdate.idnumber ||
        !staffUpdate.address || !staffUpdate.phone || !staffUpdate.idposition) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }

    let role = 0;
    switch (Number(staffUpdate.idposition)) {
        case 3:
            role = 5;
            break;
        case 1:
            role = 1;
            break;
        case 5:
            role = 3;
            break;
        default:
            role = 0;
            break;
    }

    try {
        let account = await AccountService.FindOneById(id);

        let staff = await StaffService.FindOneById(id);
        if (staff.length === 0) {
            return res.status(400).json(FormatResponseJson(400, "Staff id is not found!", []));
        }

        if (account.length === 0) {
            return res.status(400).json(FormatResponseJson(400, "Account is not found!", []));
        }

        let staffUpdated = await StaffService.Update(id, staffUpdate);
        let accountInfo =
        {
            username: account[0].tendangnhap,
            password: account[0].matkhau,
            role: role,
        }

        let accountUpdated = await AccountService.Update(id, accountInfo);
        if (!staffUpdated) {
            return res.status(401).json(FormatResponseJson(401, "Updated staff failed!", []));
        }
        return res.status(200).json(FormatResponseJson(200, "Updated staff successful!", [staffUpdated]));

    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}

const DeleteStaff = async (req, res) => {
    let id = req.params.id;
    if (!id) {
        console.log("Id is not empty!");
        return res.status(404).json(FormatResponseJson(404, "Failed", []));
    }

    try {
        let staff = await StaffService.FindOneById(id);
        if (staff.length === 0) {
            return res.status(404).json(FormatResponseJson(404, "Staff id is not found!", []));
        }

        await AccountService.Delete(id);

        let idStaffDelete = await StaffService.Delete(id);
        if (idStaffDelete !== 0) {
            return res.status(200).json(FormatResponseJson(200, "Deleted staff successful!", [{ "idnhanvien": idStaffDelete }]));
        }
        return res.status(401).json(FormatResponseJson(401, "Delete staff failed!", []));

    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}

export {
    GetStaff,
    GetStaffList,
    NewStaff,
    UpdateStaff,
    DeleteStaff
}
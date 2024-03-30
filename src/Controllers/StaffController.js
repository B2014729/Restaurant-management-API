import StaffService from "../Services/StaffService.js";
import FormatResponseJson from "../Services/FotmatResponse.js";
import AccountService from "../Services/AccountService.js";
import moment from "moment";
import CalendrierWorkStaffService from "../Services/CalendrierWorkStaffService.js";
import * as JWT from "../Services/JWTService.js";

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

        //Custom data render
        if (staff[0].gioitinh == 0) {
            staff[0].gioitinhchu = 'Nữ';
        } else {
            staff[0].gioitinhchu = "Nam";
        }

        if (staff[0].ngaythamgia !== null) {
            staff[0].ngaythamgia = moment(staff[0].ngaythamgia).format("YYYY-MM-DD");
        }
        staff[0].ngaysinh = moment(staff[0].ngaysinh).format("YYYY-MM-DD");

        return res.status(200).json(FormatResponseJson(200, "Successful", staff));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}

const GetStaffWithToken = async (req, res) => {
    let { token } = req.body;

    if (!token) {
        return res.status(404).json(FormatResponseJson(404, "Token is not empty!", []));
    }

    try {
        let id = JWT.getUserIdFromToken(token);
        let staff = await StaffService.FindOneById(id);
        let account = await AccountService.FindOneById(id);
        if (staff.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found staff id ${id}`, []));
        }

        //Custom data render
        if (staff[0].gioitinh == 0) {
            staff[0].gioitinhchu = 'Nữ';
        } else {
            staff[0].gioitinhchu = "Nam";
        }

        if (staff[0].ngaythamgia !== null) {
            staff[0].ngaythamgia = moment(staff[0].ngaythamgia).format("YYYY-MM-DD");
        }
        staff[0].ngaysinh = moment(staff[0].ngaysinh).format("YYYY-MM-DD");

        staff[0].tendangnhap = account[0].tendangnhap;
        staff[0].quyen = account[0].quyen;

        return res.status(200).json(FormatResponseJson(200, "Successful", staff));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}

const GetStaffList = async (req, res) => {
    try {
        let staffList = await StaffService.FindAll();

        //Custom list data
        for (let index = 0; index < staffList.length; index++) {
            if (staffList[index].gioitinh == 0) {
                staffList[index].gioitinhchu = 'Nữ';
            } else {
                staffList[index].gioitinhchu = "Nam";
            }

            staffList[index].ngaysinh = moment(staffList[index].ngaysinh).format("YYYY-MM-DD");
        }

        return res.status(200).json(FormatResponseJson(200, "Successful", staffList));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const NewStaff = async (req, res) => {
    let staffNew = req.body;
    if (!staffNew.fullname || !staffNew.dateofbirth || !staffNew.gender || !staffNew.idnumber ||
        !staffNew.address || !staffNew.phone || !staffNew.idposition || !staffNew.idsalary
        || !staffNew.status || !staffNew.datestart) {
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
    let token = req.params.id;
    let staffUpdate = req.body;
    if (!id) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    } else {
        id = Number(id);
        staffUpdate.gender = Number(staffUpdate.gender);
        if (isNaN(id)) {
            try {
                id = JWT.getUserIdFromToken(token);//Neu nguoi dung k truyen id ma truyen token
            } catch (error) {
                console.log(error);
                return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
            }
        }
    }

    if (!staffUpdate.fullname || !staffUpdate.dateofbirth || !staffUpdate.idnumber ||
        !staffUpdate.address || !staffUpdate.phone || !staffUpdate.idposition || !staffUpdate.datestart ||
        !staffUpdate.status || !staffUpdate.idsalary) {
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

const UploadAvatar = async (req, res) => {
    let token = req.params.token;
    if (!token) {
        return res.status(404).json(FormatResponseJson(404, "Token is not empty!", []));
    }
    let image = '';
    if (req.hasOwnProperty('file')) {
        if (req.file.hasOwnProperty('filename')) {
            image = 'http://localhost:8000/images/' + req.file.filename;
        }
    } else {
        return res.status(400).json(FormatResponseJson(400, "Upload faild!", []));
    }

    try {
        let id = JWT.getUserIdFromToken(token);
        if (!id) {
            return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
        } else {
            id = Number(id);
            if (isNaN(id)) {
                return res.status(404).json(FormatResponseJson(404, "Id is not Number", []));
            }
        }

        let staff = await StaffService.FindOneById(id);

        if (staff.length === 0) {
            return res.status(400).json(FormatResponseJson(400, "Staff id is not found!", []));
        }

        let staffUploadAvatar = await StaffService.UploadAvatar(id, image);

        if (!staffUploadAvatar) {
            return res.status(401).json(FormatResponseJson(401, "Updated staff failed!", []));
        }
        return res.status(200).json(FormatResponseJson(200, "Updated staff successful!", [staffUploadAvatar]));

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

const Salary = async (req, res) => {
    let id = req.params.id;
    let idPhase = req.params.idPhase;
    if (!id) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    } else {
        id = Number(id);
        idPhase = Number(idPhase);
        if (isNaN(id) && isNaN(idPhase)) {
            return res.status(404).json(FormatResponseJson(404, "Id & idPhase is not Number", []));
        }
    }

    try {
        let weekWork = await CalendrierWorkStaffService.GetCalendrierOfStaff(id, idPhase);
        if (!weekWork) {
            return res.status(400).json(FormatResponseJson(400, `Not found calendried and phase`, []));
        } else {
            if (weekWork.length <= 0) {
                return res.status(400).json(FormatResponseJson(400, `Not found calendried and phase`, []));
            }
            let staffInfo = await StaffService.FindOneById(id);
            let money = 10000;
            switch (staffInfo[0].idluong) {
                case 1:
                    money = 18000
                    break;
                case 2:
                    money = 26000
                    break;
                case 3:
                    money = 30000
                    break;
                case 4:
                    money = 45000
                    break;

                default:
                    break;
            }

            let sumHour = 0;
            for (let index = 0; index < weekWork.length; index++) {
                delete weekWork[index].idlichlamviec;
                delete weekWork[index].idnhanvien;

                const item = weekWork[index];
                if (item.ngay1 == 1 || item.ngay1 == 2 || item.ngay1 == 3) sumHour += 6;
                if (item.ngay1 == 4) sumHour += 18;
                if (item.ngay1 == 6 || item.ngay1 == 5) sumHour += 12;

                if (item.ngay2 == 1 || item.ngay2 == 2 || item.ngay2 == 3) sumHour += 6;
                if (item.ngay2 == 4) sumHour += 18;
                if (item.ngay2 == 6 || item.ngay2 == 5) sumHour += 12;

                if (item.ngay3 == 1 || item.ngay3 == 2 || item.ngay3 == 3) sumHour += 6;
                if (item.ngay3 == 4) sumHour += 18;
                if (item.ngay3 == 6 || item.ngay3 == 5) sumHour += 12;

                if (item.ngay4 == 1 || item.ngay4 == 2 || item.ngay4 == 3) sumHour += 6;
                if (item.ngay4 == 4) sumHour += 18;
                if (item.ngay4 == 6 || item.ngay4 == 5) sumHour += 12;

                if (item.ngay5 == 1 || item.ngay5 == 2 || item.ngay5 == 3) sumHour += 6;
                if (item.ngay5 == 4) sumHour += 18;
                if (item.ngay5 == 6 || item.ngay5 == 5) sumHour += 12;

                if (item.ngay6 == 1 || item.ngay6 == 2 || item.ngay6 == 3) sumHour += 6;
                if (item.ngay6 == 4) sumHour += 18;
                if (item.ngay6 == 6 || item.ngay6 == 5) sumHour += 12;

                if (item.ngay7 == 1 || item.ngay7 == 2 || item.ngay7 == 3) sumHour += 6;
                if (item.ngay7 == 4) sumHour += 18;
                if (item.ngay7 == 6 || item.ngay7 == 5) sumHour += 12;
            }

            let dataRes = {
                nhanvien: staffInfo[0],
                tonggio: sumHour,
                luong: money,
                thuong: 250000,
                phat: 120000,
                chitiet: weekWork,
            }
            return res.status(200).json(FormatResponseJson(200, "Successful", dataRes));
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}

const SalaryTable = async (req, res) => {
    let idPhase = req.params.idPhase;
    if (!idPhase) {
        return res.status(404).json(FormatResponseJson(404, "idPhase is not empty!", []));
    } else {
        idPhase = Number(idPhase);

        if (isNaN(idPhase)) {
            return res.status(404).json(FormatResponseJson(404, "IdPhase is not Number", []));
        }
    }

    try {
        let staffList = await StaffService.FindAll();

        let calendrier = await CalendrierWorkStaffService.GetCalendrierWorkWithPlase(idPhase);
        if (!calendrier) {
            return res.status(400).json(FormatResponseJson(400, `Not found calendrier and phase`, []));
        }

        let dataResList = [];

        for (let index = 0; index < staffList.length; index++) {
            const element = staffList[index];

            let weekWork = await CalendrierWorkStaffService.GetCalendrierOfStaff(element.idnhanvien, idPhase);
            if (weekWork != undefined && weekWork.length > 0) {
                let money = 10000;
                switch (element.idluong) {
                    case 1:
                        money = 18000
                        break;
                    case 2:
                        money = 26000
                        break;
                    case 3:
                        money = 30000
                        break;
                    case 4:
                        money = 45000
                        break;
                    default:
                        break;
                }

                let sumHour = 0;
                for (let i = 0; i < weekWork.length; i++) {
                    delete weekWork[i].idlichlamviec;
                    delete weekWork[i].idnhanvien;

                    const item = weekWork[i];
                    if (item.ngay1 == 1 || item.ngay1 == 2 || item.ngay1 == 3) sumHour += 6;
                    if (item.ngay1 == 4) sumHour += 18;
                    if (item.ngay1 == 6 || item.ngay1 == 5) sumHour += 12;

                    if (item.ngay2 == 1 || item.ngay2 == 2 || item.ngay2 == 3) sumHour += 6;
                    if (item.ngay2 == 4) sumHour += 18;
                    if (item.ngay2 == 6 || item.ngay2 == 5) sumHour += 12;

                    if (item.ngay3 == 1 || item.ngay3 == 2 || item.ngay3 == 3) sumHour += 6;
                    if (item.ngay3 == 4) sumHour += 18;
                    if (item.ngay3 == 6 || item.ngay3 == 5) sumHour += 12;

                    if (item.ngay4 == 1 || item.ngay4 == 2 || item.ngay4 == 3) sumHour += 6;
                    if (item.ngay4 == 4) sumHour += 18;
                    if (item.ngay4 == 6 || item.ngay4 == 5) sumHour += 12;

                    if (item.ngay5 == 1 || item.ngay5 == 2 || item.ngay5 == 3) sumHour += 6;
                    if (item.ngay5 == 4) sumHour += 18;
                    if (item.ngay5 == 6 || item.ngay5 == 5) sumHour += 12;

                    if (item.ngay6 == 1 || item.ngay6 == 2 || item.ngay6 == 3) sumHour += 6;
                    if (item.ngay6 == 4) sumHour += 18;
                    if (item.ngay6 == 6 || item.ngay6 == 5) sumHour += 12;

                    if (item.ngay7 == 1 || item.ngay7 == 2 || item.ngay7 == 3) sumHour += 6;
                    if (item.ngay7 == 4) sumHour += 18;
                    if (item.ngay7 == 6 || item.ngay7 == 5) sumHour += 12;
                }

                dataResList.push({
                    nhanvien: element,
                    tonggio: sumHour,
                    luong: money,
                    thuong: 250000,
                    phat: 120000,
                    chitiet: weekWork,
                });
            }
        }
        return res.status(200).json(FormatResponseJson(200, "Successful", dataResList));
    } catch (error) {
        console.log(error);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}

export {
    GetStaff,
    GetStaffWithToken,
    GetStaffList,
    NewStaff,
    UpdateStaff,
    UploadAvatar,
    DeleteStaff,
    Salary,
    SalaryTable,
}

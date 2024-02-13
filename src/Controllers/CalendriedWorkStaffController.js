import CalendrierWorkStaffService from "../Services/CalendrierWorkStaffService.js";
import StaffService from "../Services/StaffService.js";
import FormatResponseJson from "../Services/FotmatResponse.js";

const GetAllPhase = async (req, res) => {
    try {
        let phase = await CalendrierWorkStaffService.GetAllPhase();
        if (phase.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found`, []));
        }
        return res.status(200).json(FormatResponseJson(200, "Successful", phase));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}


const GetCalendriedWithPhase = async (req, res) => {
    let idPhase = req.body.idPhase;

    if (!idPhase) {
        return res.status(404).json(FormatResponseJson(404, "idPhase is not empty!", []));
    } else {
        idPhase = Number(idPhase);
        if (isNaN(idPhase)) {
            return res.status(404).json(FormatResponseJson(404, "idPhase is not Number", []));
        }
    }

    try {
        let calendried = await CalendrierWorkStaffService.GetCalendriedWorkWithPlase(idPhase);
        if (calendried.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found customer id ${idPhase}`, []));
        }

        let weekOne = [];
        let weekTwo = [];
        let weekThree = [];
        let weekFour = [];
        let weekFive = [];

        for (let index = 0; index < calendried.length; index++) {
            let week = calendried[index].tuan;
            delete calendried[index].idgiaidoan;
            delete calendried[index].idlichlamviec;
            delete calendried[index].tuan;

            let resultStaff = await StaffService.FindOneById(calendried[index].idnhanvien); // Lay thong tin nhan vien lap hoa don

            calendried[index].tennhanvien = resultStaff[0].hoten;
            calendried[index].chucvu = resultStaff[0].tenchucvu;

            switch (week) {
                case 1:
                    weekOne.push(calendried[index])
                    break;
                case 2:
                    weekTwo.push(calendried[index])
                    break;
                case 3:
                    weekThree.push(calendried[index])
                    break;
                case 4:
                    weekFour.push(calendried[index])
                    break;
                case 5:
                    weekFive.push(calendried[index])
                    break;
                default:
                    break;
            }
        }

        let dataRes = [
            {
                tuan1: weekOne,
                tuan2: weekTwo,
                tuan3: weekThree,
                tuan4: weekFour,
                tuan5: weekFive,
            }
        ]

        return res.status(200).json(FormatResponseJson(200, "Successful", dataRes));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}

export {
    GetCalendriedWithPhase,
    GetAllPhase
}
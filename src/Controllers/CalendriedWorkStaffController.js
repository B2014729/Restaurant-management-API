import CalendrierWorkStaffService from "../Services/CalendrierWorkStaffService.js";
import StaffService from "../Services/StaffService.js";
import FormatResponseJson from "../Services/FotmatResponse.js";

//Laty tat ca cac giai doan lam viec
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

const CreatePhase = async (req, res) => {
    let { startdate, enddate } = req.body;
    if (!startdate || !enddate) {
        return res.status(404).json(FormatResponseJson(404, "idPhase is not empty!", []));
    } else {
        try {
            let resultAddPhase = await CalendrierWorkStaffService.CreateNewPhase(startdate, enddate);

            await CalendrierWorkStaffService.CreateNewCalendrier(resultAddPhase[0].idgiaidoan, resultAddPhase[0].songay)
            return res.status(200).json(FormatResponseJson(200, "Successful", []));
        } catch (error) {
            console.log(error);
            return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
        }
    }
}


const GetCalendrierWithPhase = async (req, res) => {
    let idPhase = req.params.idPhase;

    if (!idPhase) {
        return res.status(404).json(FormatResponseJson(404, "idPhase is not empty!", []));
    } else {
        idPhase = Number(idPhase);
        if (isNaN(idPhase)) {
            return res.status(404).json(FormatResponseJson(404, "idPhase is not Number", []));
        }
    }

    try {
        let calendrier = await CalendrierWorkStaffService.GetCalendrierWorkWithPlase(idPhase);
        if (calendrier.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found customer id ${idPhase}`, []));
        }

        let weekOne = [];
        let weekTwo = [];
        let weekThree = [];
        let weekFour = [];
        let weekFive = [];

        for (let index = 0; index < calendrier.length; index++) {
            let week = calendrier[index].tuan;
            delete calendrier[index].idgiaidoan;
            delete calendrier[index].tuan;

            let resultStaff = await StaffService.FindOneById(calendrier[index].idnhanvien); // Lay thong tin nhan vien lap hoa don

            calendrier[index].tennhanvien = resultStaff[0].hoten;
            calendrier[index].chucvu = resultStaff[0].tenchucvu;

            switch (week) {
                case 1:
                    weekOne.push(calendrier[index])
                    break;
                case 2:
                    weekTwo.push(calendrier[index])
                    break;
                case 3:
                    weekThree.push(calendrier[index])
                    break;
                case 4:
                    weekFour.push(calendrier[index])
                    break;
                case 5:
                    weekFive.push(calendrier[index])
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


const GetCalendrierArrangeWithPhase = async (req, res) => {
    let idPhase = req.params.idPhase;

    if (!idPhase) {
        return res.status(404).json(FormatResponseJson(404, "Id Phase is not empty!", []));
    } else {
        idPhase = Number(idPhase);
        if (isNaN(idPhase)) {
            return res.status(404).json(FormatResponseJson(404, "idPhase is not Number", []));
        }
    }

    try {
        let calendrier = await CalendrierWorkStaffService.GetCalendrierArrangeWithPlase(idPhase);
        if (!calendrier || calendrier.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found customer id ${idPhase}`, []));
        }

        let weekOne = [];
        let weekTwo = [];
        let weekThree = [];
        let weekFour = [];
        let weekFive = [];

        for (let index = 0; index < calendrier.length; index++) {
            let week = calendrier[index].tuan;
            delete calendrier[index].idgiaidoan;
            delete calendrier[index].tuan;

            let resultStaff = await StaffService.FindOneById(calendrier[index].idnhanvien); // Lay thong tin nhan vien lap hoa don

            calendrier[index].tennhanvien = resultStaff[0].hoten;
            calendrier[index].chucvu = resultStaff[0].tenchucvu;

            switch (week) {
                case 1:
                    weekOne.push(calendrier[index])
                    break;
                case 2:
                    weekTwo.push(calendrier[index])
                    break;
                case 3:
                    weekThree.push(calendrier[index])
                    break;
                case 4:
                    weekFour.push(calendrier[index])
                    break;
                case 5:
                    weekFive.push(calendrier[index])
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

const CreateCalendrierArrange = async (req, res) => {
    let { workWeek } = req.body;
    if (!workWeek) {
        return res.status(404).json(FormatResponseJson(404, "Woerk week is not empty!", []));
    } else {
        try {
            let flagError = false;
            for (let index = 0; index < workWeek.length; index++) {
                let resultadd = await CalendrierWorkStaffService.CreateNewDetailWorkCalendrier(workWeek[index]);
                console.log(resultadd);
                if (!resultadd) {
                    flagError = true;
                }
            }
            if (flagError) {
                return res.status(400).json(FormatResponseJson(400, "Erro when add calendrier", []));
            }
            return res.status(200).json(FormatResponseJson(200, "Successful", []));
        } catch (error) {
            console.log(error);
            return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
        }
    }
}
export {
    GetCalendrierWithPhase,
    GetCalendrierArrangeWithPhase,
    CreateCalendrierArrange,
    GetAllPhase,
    CreatePhase,
}
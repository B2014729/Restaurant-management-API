import FormatResponseJson from "../Services/FotmatResponse.js";
import EvaluateService from "../Services/EvaluateService.js";
import * as JWT from '../Services/JWTService.js';
import e from "cors";

const GetEvaluate = async (req, res) => {
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
        let evaluate = await EvaluateService.FindOneById(id);
        if (evaluate.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found evaluate id ${id}`, []));
        }
        delete evaluate.matkhau;
        return res.status(200).json(FormatResponseJson(200, "Successful", evaluate));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}


const GetEvaluateList = async (req, res) => {
    try {
        let evaluateList = await EvaluateService.FindAll();
        if (evaluateList.length > 0) {
            evaluateList.forEach(element => {
                delete element.matkhau;
            });
        }
        return res.status(200).json(FormatResponseJson(200, "Successful", evaluateList));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const NewEvaluate = async (req, res) => {
    let evaluateNew = req.body;
    if (!evaluateNew.token || !evaluateNew.noidung || !evaluateNew.sosao) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }
    evaluateNew.thoigian = new Date();
    evaluateNew.idkhachhang = JWT.getUserIdFromToken(evaluateNew.token);

    try {
        let result = await EvaluateService.Create(evaluateNew);
        if (result.length > 0) {
            return res.status(200).json(FormatResponseJson(200, "Create evaluate successful!", result));
        }
        return res.status(401).json(FormatResponseJson(401, "Create evaluate failed!", []));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const UpdateEvaluate = async (req, res) => {
    let id = req.params.id;
    let evaluateUpdate = req.body;

    if (!evaluateUpdate.noidung || !evaluateUpdate.sosao) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }
    evaluateUpdate.thoigian = new Date();
    if (!id) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    } else {
        id = Number(id);
        if (isNaN(id)) {
            return res.status(404).json(FormatResponseJson(404, "Id is not Number", []));
        }
    }

    try {
        let result = await EvaluateService.Update(id, evaluateUpdate);
        if (!result || result.length === 0) {
            return res.status(401).json(FormatResponseJson(401, "Update evaluate failed!", []));
        }
        return res.status(200).json(FormatResponseJson(200, "Updated evaluate successful!", [result]));

    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const DeleteEvaluate = async (req, res) => {
    let id = req.params.id;
    if (!id) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    }

    try {
        let evaluate = await EvaluateService.FindOneById(id);
        if (evaluate.length === 0) {
            return res.status(404).json(FormatResponseJson(404, "evaluate is not found!", []));
        }

        let idEvaluateDelete = await EvaluateService.Delete(id);
        if (idEvaluateDelete !== 0) {
            return res.status(200).json(FormatResponseJson(200, "Deleted evaluate successful!", [{ "iddanhgia": idEvaluateDelete }]));
        }
        return res.status(401).json(FormatResponseJson(401, "Delete evaluate failed!", []));

    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}

export {
    GetEvaluate,
    GetEvaluateList,
    NewEvaluate,
    UpdateEvaluate,
    DeleteEvaluate
}
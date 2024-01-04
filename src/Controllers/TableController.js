import TableService from "../Services/TableService.js";
import FormatResponseJson from "../Services/FotmatResponse.js";

const GetTable = async (req, res) => {
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
        let table = await TableService.FindOneById(id);
        if (table.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found table id ${id}`, []));
        }
        return res.status(200).json(FormatResponseJson(200, "Successful", table));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}


const GetTableList = async (req, res) => {
    try {
        let tableList = await TableService.FindAll();
        return res.status(200).json(FormatResponseJson(200, "Successful", tableList));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const NewTable = async (req, res) => {
    try {
        let result = await TableService.Create();
        if (result.length > 0) {
            return res.status(200).json(FormatResponseJson(200, "Create table successful!", result));
        }
        return res.status(401).json(FormatResponseJson(401, "Create table failed!", []));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const UpdateTable = async (req, res) => {
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
        let result = await TableService.Update(id);
        if (!result || result.length === 0) {
            return res.status(401).json(FormatResponseJson(401, "Update table failed!", []));
        }
        return res.status(200).json(FormatResponseJson(200, "Updated table successful!", [result]));

    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const DeleteTable = async (req, res) => {
    let id = req.params.id;
    if (!id) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    }

    try {
        let table = await TableService.FindOneById(id);
        if (table.length === 0) {
            return res.status(404).json(FormatResponseJson(404, "Table is not found!", []));
        }

        let idTableDelete = await TableService.Delete(id);
        if (idTableDelete !== 0) {
            return res.status(200).json(FormatResponseJson(200, "Deleted table successful!", [{ "idban": idTableDelete }]));
        }
        return res.status(401).json(FormatResponseJson(401, "Delete table failed!", []));

    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}

export {
    GetTable,
    GetTableList,
    NewTable,
    UpdateTable,
    DeleteTable
}
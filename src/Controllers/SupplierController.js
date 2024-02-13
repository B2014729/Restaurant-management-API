import SupplierService from "../Services/SupplierService.js";
import FormatResponseJson from "../Services/FotmatResponse.js";

const GetSupplier = async (req, res) => {
    let id = req.params.id;
    console.log(id);
    if (!id) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    } else {
        id = Number(id);
        if (isNaN(id)) {
            return res.status(404).json(FormatResponseJson(404, "Id is not Number", []));
        }
    }
    try {
        let supplier = await SupplierService.FindOneById(id);
        if (supplier.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found supplier id ${id}`, []));
        }
        return res.status(200).json(FormatResponseJson(200, "Successful", supplier));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}


const GetSupplierList = async (req, res) => {
    try {
        let supplierList = await SupplierService.FindAll();
        return res.status(200).json(FormatResponseJson(200, "Successful", supplierList));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const NewSupplier = async (req, res) => {
    let newSupplier = req.body;

    if (!newSupplier.name || !newSupplier.address || !newSupplier.phone || !newSupplier.bank || !newSupplier.bankName) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }

    try {
        let result = await SupplierService.Create(newSupplier);
        if (result.length > 0) {
            return res.status(200).json(FormatResponseJson(200, "Create supplier successful!", result));
        }
        return res.status(401).json(FormatResponseJson(401, "Create suppier failed!", []));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const UpdateSupplier = async (req, res) => {
    let id = req.params.id;
    let updateSupplier = req.body;
    if (!updateSupplier.name || !updateSupplier.address || !updateSupplier.phone || !updateSupplier.bank || !updateSupplier.bankName) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }

    if (!id) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    } else {
        id = Number(id);
        if (isNaN(id)) {
            return res.status(404).json(FormatResponseJson(404, "Id is not Number", []));
        }
    }

    try {
        let result = await SupplierService.Update(id, updateSupplier);
        if (!result || result.length === 0) {
            return res.status(401).json(FormatResponseJson(401, "Update supplier failed!", []));
        }
        return res.status(200).json(FormatResponseJson(200, "Updated supplier successful!", [result]));

    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const DeleteSupplier = async (req, res) => {
    let id = req.params.id;

    if (!id) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    }

    try {
        let supplier = await SupplierService.FindOneById(id);
        if (supplier.length === 0) {
            return res.status(404).json(FormatResponseJson(404, "Supplier is not found!", []));
        }

        let idSupplierDelete = await SupplierService.Delete(id);
        if (idSupplierDelete !== 0) {
            return res.status(200).json(FormatResponseJson(200, "Deleted supplier successful!", [{ "idnhacungcap": idSupplierDelete }]));
        }
        return res.status(401).json(FormatResponseJson(401, "Delete supplier failed!", []));

    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}

export {
    GetSupplier,
    GetSupplierList,
    NewSupplier,
    UpdateSupplier,
    DeleteSupplier
}
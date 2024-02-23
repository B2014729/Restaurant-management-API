import CustomerService from "../Services/CustomerService.js";
import FormatResponseJson from "../Services/FotmatResponse.js";

const GetCustomer = async (req, res) => {
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
        let customer = await CustomerService.FindOneById(id);
        let quantityOrderTable = await CustomerService.GetQuantityOrderTable(id);
        let detailOrderTable = await CustomerService.GetDetailOrderTable(id);
        if (customer.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found customer id ${id}`, []));
        }
        customer[0].datban = quantityOrderTable[0].soluong;
        customer[0].chitietdatban = detailOrderTable;

        return res.status(200).json(FormatResponseJson(200, "Successful", customer));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}


const GetCustomerList = async (req, res) => {
    try {
        let customerList = await CustomerService.FindAll();
        for (let index = 0; index < customerList.length; index++) {
            const element = customerList[index];
            let quantityOrderTable = await CustomerService.GetQuantityOrderTable(element.idkhachhang);
            element.datban = quantityOrderTable[0].soluong;
        }
        return res.status(200).json(FormatResponseJson(200, "Successful", customerList));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const NewCustomer = async (req, res) => {
    let customerNew = req.body;
    if (!customerNew.phone || !customerNew.username || !customerNew.password) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }

    try {
        let result = await CustomerService.Create(customerNew);
        console.log(result);
        if (result.length > 0) {
            return res.status(200).json(FormatResponseJson(200, "Create customer successful!", result));
        }
        return res.status(401).json(FormatResponseJson(401, "Create customer failed!", []));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const UpdateCustomer = async (req, res) => {
    let idCustomer = req.params.id;
    let updateCustomer = req.body;
    if (!updateCustomer.phone || !updateCustomer.username || !updateCustomer.password) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }

    if (!idCustomer) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    } else {
        id = Number(id);
        if (isNaN(id)) {
            return res.status(404).json(FormatResponseJson(404, "Id is not Number", []));
        }
    }

    try {
        let result = await CustomerService.Update(idCustomer, updateCustomer);
        if (!result || result.length === 0) {
            return res.status(401).json(FormatResponseJson(401, "Update customer failed!", []));
        }
        return res.status(200).json(FormatResponseJson(200, "Updated customer successful!", [result]));

    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const DeleteCustomer = async (req, res) => {
    let id = req.params.id;
    if (!id) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    }

    try {
        let customer = await CustomerService.FindOneById(id);
        if (customer.length === 0) {
            return res.status(404).json(FormatResponseJson(404, "Customer is not found!", []));
        }

        let idCustomerDelete = await CustomerService.Delete(id);
        if (idCustomerDelete !== 0) {
            return res.status(200).json(FormatResponseJson(200, "Deleted customer successful!", [{ "idkhachhang": idCustomerDelete }]));
        }
        return res.status(401).json(FormatResponseJson(401, "Delete customer failed!", []));

    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}


const GetEvalues = async (req, res) => {
    try {
        let evalueList = await CustomerService.FindAllEvalues();
        for (let index = 0; index < evalueList.length; index++) {
            const element = evalueList[index];
            let customerInfor = await CustomerService.FindOneById(element.idkhachhang);
            element.tendangnhap = customerInfor[0].tendangnhap;

        }
        return res.status(200).json(FormatResponseJson(200, "Successful", evalueList));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

export {
    GetCustomer,
    GetCustomerList,
    NewCustomer,
    UpdateCustomer,
    DeleteCustomer,
    GetEvalues,
}
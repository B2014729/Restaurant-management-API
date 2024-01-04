import DishService from "../Services/DishService.js";
import FormatResponseJson from "../Services/FotmatResponse.js";

const GetDish = async (req, res) => {
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
        let dish = await DishService.FindOneById(id);
        if (dish.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found dish id ${id}`, []));
        }
        return res.status(200).json(FormatResponseJson(200, "Successful", dish));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}


const GetDishList = async (req, res) => {
    try {
        let dishList = await DishService.FindAll();
        return res.status(200).json(FormatResponseJson(200, "Successful", dishList));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const NewDish = async (req, res) => {
    let dishNew = req.body;
    if (!dishNew.name || !dishNew.price || !dishNew.imageUrl || !dishNew.unit || !dishNew.type) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }

    try {
        let result = await DishService.Create(dishNew);
        if (result.length > 0) {
            return res.status(200).json(FormatResponseJson(200, "Create dish successful!", result));
        }
        return res.status(401).json(FormatResponseJson(401, "Create dish failed!", []));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const UpdateDish = async (req, res) => {
    let idDish = req.params.id;
    let updateDish = req.body;
    if (!updateDish.name || !updateDish.price || !updateDish.imageUrl || !updateDish.unit || !updateDish.type) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }

    if (!idDish) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    } else {
        id = Number(id);
        if (isNaN(id)) {
            return res.status(404).json(FormatResponseJson(404, "Id is not Number", []));
        }
    }

    try {
        let result = await DishService.Update(idDish, updateDish);
        if (!result || result.length === 0) {
            return res.status(401).json(FormatResponseJson(401, "Update dish failed!", []));
        }
        return res.status(200).json(FormatResponseJson(200, "Updated dish successful!", [result]));

    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const DeleteDish = async (req, res) => {
    let id = req.params.id;
    if (!id) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    }

    try {
        let dish = await DishService.FindOneById(id);
        if (dish.length === 0) {
            return res.status(404).json(FormatResponseJson(404, "Dish is not found!", []));
        }

        let idDishDelete = await DishService.Delete(id);
        if (idDishDelete !== 0) {
            return res.status(200).json(FormatResponseJson(200, "Deleted dish successful!", [{ "idmon": idDishDelete }]));
        }
        return res.status(401).json(FormatResponseJson(401, "Delete dish failed!", []));

    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}

export {
    GetDish,
    GetDishList,
    NewDish,
    UpdateDish,
    DeleteDish
}
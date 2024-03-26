import DishService from "../Services/DishService.js";
import UnitService from '../Services/UnitService.js';
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
        let unit = await UnitService.FindOneById(dish[0].iddonvitinh);
        dish[0].donvitinh = unit[0].tendonvi;

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
        let resultData = await DishService.FindAll();
        return res.status(200).json(FormatResponseJson(200, "Successful", resultData));
    } catch (error) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const GetDishListOrderByType = async (req, res) => {
    try {
        let resultData = [];
        let listType = await DishService.GetAllDishType();
        for (let index = 0; index < listType.length; index++) {
            const type = listType[index];
            let listDish = await DishService.FindAllWithType(type.idloai);

            for (let i = 0; i < listDish.length; i++) {
                const element = listDish[i];
                let unit = await UnitService.FindOneById(element.iddonvitinh);
                element.donvitinh = unit[0].tendonvi;
            }
            // resultData[type.tenloai] = listDish;
            let resultListDishAndType = {
                idloai: type.idloai,
                tenloai: type.tenloai,
                mon: listDish,
            }
            resultData.push(resultListDishAndType);
        }
        return res.status(200).json(FormatResponseJson(200, "Successful", resultData));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const NewDish = async (req, res) => {
    let dishNew = req.body;
    if (!dishNew.name || !dishNew.price || !dishNew.unit || !dishNew.type) {
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
    if (!updateDish.name || !updateDish.price || !updateDish.unit || !updateDish.type || !updateDish.status) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }

    if (!idDish) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    } else {
        idDish = Number(idDish);
        if (isNaN(idDish)) {
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

        let dishDelete = await DishService.Delete(id);

        if (dishDelete.length > 0) {
            return res.status(200).json(FormatResponseJson(200, "Deleted dish successful!", dishDelete));
        }
        return res.status(401).json(FormatResponseJson(401, "Delete dish failed!", []));

    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}

const GetMenuInfor = async (req, res) => {
    try {
        let resultData = [];
        let listType = await DishService.GetAllDishType();
        for (let index = 0; index < listType.length; index++) {
            const type = listType[index];
            let listDish = await DishService.GetMenu(type.idloai);

            for (let i = 0; i < listDish.length; i++) {
                const element = listDish[i];
                let unit = await UnitService.FindOneById(element.iddonvitinh);
                element.donvitinh = unit[0].tendonvi;
            }
            // resultData[type.tenloai] = listDish;
            let resultListDishAndType = {
                tenloai: type.tenloai,
                mon: listDish,
            }
            resultData.push(resultListDishAndType);
        }
        return res.status(200).json(FormatResponseJson(200, "Successful", resultData));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const DeleteOutMenu = async (req, res) => {
    let id = req.params.id;
    console.log(id);
    if (!id) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    }

    try {
        let dishDelete = await DishService.DeleteOutMenu(id);

        if (dishDelete) {
            return res.status(200).json(FormatResponseJson(200, "Successful!", []));
        }
        return res.status(401).json(FormatResponseJson(401, "Delete dish failed!", []));

    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}

const AddDishOnMenu = async (req, res) => {
    let { idDish } = req.body;

    if (!idDish) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    } else {
        idDish = Number(idDish);

        if (isNaN(idDish)) {
            return res.status(404).json(FormatResponseJson(404, "Id is not Number", []));
        }
    }

    try {
        let result = await DishService.AddDishOnMenu(idDish);
        if (result.length > 0) {
            return res.status(200).json(FormatResponseJson(200, "Create dish successful!", result));
        }
        return res.status(401).json(FormatResponseJson(401, "Create dish failed!", []));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const GetDishSellALot = async (req, res) => {
    try {
        let resultData = [];
        let listDish = await DishService.GetDishSellALot();
        for (let index = 0; index < listDish.length; index++) {
            const dish = listDish[index];
            let dishDetail = await DishService.FindOneById(dish.idmon);
            let resultListDishAndType = {
                mon: dishDetail[0],
                soluong: dish.soluong,
            }
            resultData.push(resultListDishAndType);
        }
        return res.status(200).json(FormatResponseJson(200, "Successful", resultData));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const GetStatisticalDish = async (req, res) => { //Thong ke loai mon ban duoc  => so luong
    try {
        let resultData = [];

        let listStatisticalOnTyle = [];
        let statisticalOnDishSell = await DishService.StatisticalOnDishSell();
        for (let index = 0; index < statisticalOnDishSell.length; index++) {
            const element = statisticalOnDishSell[index];
            let dishDetail = await DishService.FindOneById(element.idmon);

            let data = {
                idloai: dishDetail[0].idloai,
                tenloai: dishDetail[0].tenloai,
                soluong: element.soluong,
            }
            listStatisticalOnTyle.push(data);
        }

        let allType = await DishService.GetAllDishType();
        for (let index = 0; index < allType.length; index++) {
            const element = allType[index];
            let quantity = 0;
            for (let i = 0; i < listStatisticalOnTyle.length; i++) {
                const item = listStatisticalOnTyle[i];
                if (element.idloai == item.idloai) {
                    quantity += Number(item.soluong);
                }
            }
            resultData.push({
                idloai: element.idloai,
                tenloai: element.tenloai,
                soluong: quantity,
            });
        }

        return res.status(200).json(FormatResponseJson(200, "Successful", resultData));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

export {
    GetDish,
    GetDishList,
    NewDish,
    UpdateDish,
    DeleteDish,
    GetDishListOrderByType,
    GetMenuInfor,
    DeleteOutMenu,
    AddDishOnMenu,
    GetDishSellALot,
    GetStatisticalDish,
}
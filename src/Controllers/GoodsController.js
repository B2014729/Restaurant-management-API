import GoodsService from "../Services/GoodsService.js";
import FormatResponseJson from "../Services/FotmatResponse.js";
import UnitService from "../Services/UnitService.js";

const GetGoods = async (req, res) => {
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
        let goods = await GoodsService.FindOneById(id);
        if (goods.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found goods id ${id}`, []));
        }
        let unitInfor = await UnitService.FindOneById(goods[0].iddonvitinh);
        goods[0].donvitinh = unitInfor[0].tendonvi;
        return res.status(200).json(FormatResponseJson(200, "Successful", goods));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}


const GetGoodsList = async (req, res) => {
    try {
        let goodsList = await GoodsService.FindAll();
        if (goodsList && goodsList.length >= 0) {
            for (let index = 0; index < goodsList.length; index++) {
                const element = goodsList[index];
                let unitInfor = await UnitService.FindOneById(element.iddonvitinh);
                element.donvitinh = unitInfor[0].tendonvi;
            }
        }
        return res.status(200).json(FormatResponseJson(200, "Successful", goodsList));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const NewGoods = async (req, res) => {
    let goodsNew = req.body;
    if (!goodsNew.name || !goodsNew.expiry || !goodsNew.description || !goodsNew.unit || !goodsNew.type) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }

    goodsNew.imageUrl = '';
    if (req.hasOwnProperty('file')) {
        if (req.file.hasOwnProperty('filename')) {
            goodsNew.imageUrl = 'http://localhost:8000/images/' + req.file.filename;
        }
    }
    try {
        let result = await GoodsService.Create(goodsNew);
        if (result.length > 0) {
            return res.status(200).json(FormatResponseJson(200, "Create goods successful!", result));
        }
        return res.status(401).json(FormatResponseJson(401, "Create goods failed!", []));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const UpdateGoods = async (req, res) => {
    let id = req.params.id;
    let updateGoods = req.body;
    console.log(updateGoods)
    if (!updateGoods.name || !updateGoods.expiry || !updateGoods.description || !updateGoods.unit || !updateGoods.type) {
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

    if (req.hasOwnProperty('file')) {
        if (req.file.hasOwnProperty('filename')) {
            updateGoods.imageUrl = 'http://localhost:8000/images/' + req.file.filename;
        }
    }

    try {
        let result = await GoodsService.Update(id, updateGoods);
        if (!result || result.length === 0) {
            return res.status(401).json(FormatResponseJson(401, "Update goods failed!", []));
        }
        return res.status(200).json(FormatResponseJson(200, "Updated goods successful!", [result]));

    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const DeleteGoods = async (req, res) => {
    let id = req.params.id;
    if (!id) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    }

    try {
        let goods = await GoodsService.FindOneById(id);
        if (goods.length === 0) {
            return res.status(404).json(FormatResponseJson(404, "Goods is not found!", []));
        }

        let idGoodsDelete = await GoodsService.Delete(id);
        if (idGoodsDelete !== 0) {
            return res.status(200).json(FormatResponseJson(200, "Deleted goods successful!", [{ "idhanghoa": idGoodsDelete }]));
        }
        return res.status(401).json(FormatResponseJson(401, "Delete goods failed!", []));

    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}

export {
    GetGoods,
    GetGoodsList,
    NewGoods,
    UpdateGoods,
    DeleteGoods
}
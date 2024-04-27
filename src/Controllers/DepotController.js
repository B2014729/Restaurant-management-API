import DepotService from "../Services/DepotService.js";
import FormatResponseJson from "../Services/FotmatResponse.js";
import GoodsService from "../Services/GoodsService.js";
import UnitService from "../Services/UnitService.js";

const GetGoodsInDepot = async (req, res) => {
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
        let goods = await DepotService.FindOneById(id);
        if (goods.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found goods id ${id}`, []));
        }

        let goodsDetail = await GoodsService.FindOneById(goods[0].idhanghoa);
        let unit = await UnitService.FindOneById(goodsDetail[0].iddonvitinh);
        goodsDetail[0].tendonvi = unit[0].tendonvi;
        let dataFormat = {
            hanghoa: goodsDetail[0],
            chitiet: goods
        }
        return res.status(200).json(FormatResponseJson(200, "Successful", [dataFormat]));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}


const GetDepotList = async (req, res) => {
    try {
        let goodsList = await DepotService.FindAll();
        let goodListAfterGroup = [];
        if (goodsList.length > 0) {
            for (let index = 0; index < goodsList.length; index++) {
                const elementcurrent = goodsList[index];
                for (let j = index + 1; j < goodsList.length; j++) {
                    const element = goodsList[j];

                    if (elementcurrent.idhanghoa === element.idhanghoa) {
                        goodsList[j] = { idhanghoa: 0 };
                        elementcurrent.soluong += element.soluong;
                        if ((new Date(elementcurrent.ngaynhap)) < (new Date(element.ngaynhap))) {
                            elementcurrent.ngaynhap = element.ngaynhap;
                        }
                    }
                }
                if (elementcurrent.idhanghoa != 0) {
                    goodListAfterGroup.push(elementcurrent);
                }
            }
            //console.log(goodListAfterGroup);

            for (let index = 0; index < goodListAfterGroup.length; index++) {
                let goodsDetail = await GoodsService.FindOneById(goodListAfterGroup[index].idhanghoa);
                if (goodsDetail.length > 0) {
                    let unit = await UnitService.FindOneById(goodsDetail[0].iddonvitinh);
                    goodsDetail[0].tendonvi = unit[0].tendonvi;
                }
                goodListAfterGroup[index].hanghoa = goodsDetail[0];
            }
        }
        return res.status(200).json(FormatResponseJson(200, "Successful", goodListAfterGroup));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const AddGoodsInDepot = async (req, res) => {
    let goodsNew = req.body;
    if (!goodsNew.idGoods || !goodsNew.quantity || !goodsNew.date) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }

    try {
        let result = await DepotService.Create(goodsNew);
        if (result.length > 0) {
            return res.status(200).json(FormatResponseJson(200, "Create goods successful!", result));
        }
        return res.status(401).json(FormatResponseJson(401, "Create goods failed!", []));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const DeleteGoodsInDepot = async (req, res) => {
    let id = req.params.id;
    if (!id) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    }

    try {
        let goods = await DepotService.FindOneById(id);
        if (goods.length === 0) {
            return res.status(404).json(FormatResponseJson(404, "Goods is not found!", []));
        }

        let idGoodsDelete = await DepotService.Delete(id);
        if (idGoodsDelete !== 0) {
            return res.status(200).json(FormatResponseJson(200, "Deleted goods successful!", [{ "idhanghoa": idGoodsDelete }]));
        }
        return res.status(401).json(FormatResponseJson(401, "Delete goods failed!", []));

    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}

const Update = async (req, res) => {
    let { listId, listQuantity } = req.body;
    if (!listId || !listQuantity) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }

    if (listId.length !== listQuantity.length) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }

    try {
        for (let index = 0; index < listId.length; index++) {
            await DepotService.Update(listId[index], listQuantity[index]);
        }
        return res.status(200).json(FormatResponseJson(200, "Updated payment successful!", []));
    } catch (error) {
        console.log(error);
    }
}

export {
    GetGoodsInDepot,
    GetDepotList,
    Update,
    DeleteGoodsInDepot,
    AddGoodsInDepot,
}
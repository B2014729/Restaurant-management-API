import PromotionService from "../Services/PromotionService.js";
import FormatResponseJson from "../Services/FotmatResponse.js";
import DishService from '../Services/DishService.js';

const GetPromotion = async (req, res) => {
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
        let Promotion = await PromotionService.FindOneById(id);
        if (Promotion.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found Promotion id ${id}`, []));
        }

        let ListDish = Promotion[1];
        let LishDishDetail = [];

        for (let index = 0; index < ListDish.length; index++) {
            const element = ListDish[index];
            let resultDish = await DishService.FindOneById(element.idmon);
            if (resultDish && resultDish.length > 0) {
                resultDish[0].soluong = element.soluong;
                LishDishDetail.push(resultDish[0]);
            }
        }

        let PromotionResult = {
            khuyenmai: Promotion[0][0],
            chitiet: LishDishDetail,
        };
        return res.status(200).json(FormatResponseJson(200, "Successful", PromotionResult));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}


const GetPromotionList = async (req, res) => {
    try {
        let ListPromotionList = [];
        let PromotionList = await PromotionService.FindAll();

        for (let index = 0; index < PromotionList.length; index++) {
            const element = PromotionList[index];
            let ListDish = element[1];
            let LishDishDetail = [];
            for (let i = 0; i < ListDish.length; i++) {
                const dish = ListDish[i];
                let resultDish = await DishService.FindOneById(dish.idmon);
                if (resultDish && resultDish.length > 0) {
                    resultDish[0].soluong = dish.soluong;
                    LishDishDetail.push(resultDish[0]);
                }
            }

            ListPromotionList.push({
                khuyenmai: element[0][0],
                chitiet: LishDishDetail,
            })
        }
        return res.status(200).json(FormatResponseJson(200, "Successful", ListPromotionList));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const NewPromotion = async (req, res) => {
    let newPromotion = req.body;

    if (!newPromotion.name || !newPromotion.dateStart || !newPromotion.dateEnd || !newPromotion.value) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }
    newPromotion.image = '';

    if (newPromotion.detailPromotion.length != 2) {
        return res.status(401).json(FormatResponseJson(401, "Detail promotion invalid, please check again!", []));
    } else {
        if (newPromotion.detailPromotion[0].length < 0 || newPromotion.detailPromotion[1].length < 0) {
            return res.status(401).json(FormatResponseJson(401, "Detail promotion invalid, please check again!", []));
        }
    }

    try {
        let result = await PromotionService.Create(newPromotion);
        if (result.length > 0) {
            return res.status(200).json(FormatResponseJson(200, "Create Promotion successful!", result));
        }
        return res.status(401).json(FormatResponseJson(401, "Create suppier failed!", []));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const UpdatePromotion = async (req, res) => {
    let idPromotion = req.params.id;

    let updatePromotion = req.body;
    if (!updatePromotion.name || !updatePromotion.dateStart ||
        !updatePromotion.dateEnd || !updatePromotion.value) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }

    if (updatePromotion.detailPromotion.length != 2) {
        return res.status(401).json(FormatResponseJson(401, "Detail promotion invalid, please check again!", []));
    } else {
        if (updatePromotion.detailPromotion[0].length < 0 || updatePromotion.detailPromotion[1].length < 0) {
            return res.status(401).json(FormatResponseJson(401, "Detail promotion invalid, please check again!", []));
        }
    }

    if (!idPromotion) {
        return res.status(404).json(FormatResponseJson(404, "idPromotion is not empty!", []));
    } else {
        idPromotion = Number(idPromotion);
        if (isNaN(idPromotion)) {
            return res.status(404).json(FormatResponseJson(404, "idPromotion is not Number", []));
        }
    }
    let promotion = await PromotionService.FindOneById(idPromotion);
    if (!promotion || promotion.length <= 0) {
        return res.status(404).json(FormatResponseJson(404, "Can not find promotion with this id promotion", []));
    } else {
        updatePromotion.image = promotion[0][0].hinhanh;
    }
    updatePromotion.idPromotion = idPromotion;

    try {
        let result = await PromotionService.Update(updatePromotion);
        if (!result || result.length === 0) {
            return res.status(401).json(FormatResponseJson(401, "Update Promotion failed!", []));
        }
        return res.status(200).json(FormatResponseJson(200, "Updated Promotion successful!", [result]));

    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const DeletePromotion = async (req, res) => {
    let id = req.params.id;

    if (!id) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    }

    try {
        let Promotion = await PromotionService.FindOneById(id);
        if (!Promotion || Promotion.length == 0) {
            return res.status(404).json(FormatResponseJson(404, "Promotion is not found!", []));
        }

        let idPromotionDelete = await PromotionService.Delete(id);
        if (idPromotionDelete !== 0) {
            return res.status(200).json(FormatResponseJson(200, "Deleted Promotion successful!", [{ "idkhuyenmai": idPromotionDelete }]));
        }
        return res.status(401).json(FormatResponseJson(401, "Delete Promotion failed!", []));

    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}

export {
    GetPromotion,
    GetPromotionList,
    NewPromotion,
    UpdatePromotion,
    DeletePromotion
}
import PromotionService from "../Services/PromotionService.js";
import FormatResponseJson from "../Services/FotmatResponse.js";
import DishService from '../Services/DishService.js';

const GetPromotion = async (req, res) => {
    let id = req.params.id;

    if (!id) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    }
    try {
        let Promotion = await PromotionService.FindOneById(id);
        if (Promotion.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found Promotion id ${id}`, []));
        }

        let ListDish = Promotion[1];
        let LishDishDetail = [];
        let totalPayment = 0;
        for (let index = 0; index < ListDish.length; index++) {
            const element = ListDish[index];
            let resultDish = await DishService.FindOneById(element.idmon);
            if (resultDish && resultDish.length > 0) {
                resultDish[0].soluong = element.soluong;
                LishDishDetail.push(resultDish[0]);
                totalPayment += resultDish[0].soluong * resultDish[0].gia;
            }
        }

        Promotion[0][0].giamgia = ((totalPayment * Promotion[0][0].giatrikhuyenmai) / 100)
        Promotion[0][0].thanhtoan = totalPayment - Promotion[0][0].giamgia;
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
        let ListPromotionResult = [];
        let PromotionList = await PromotionService.FindAll();

        for (let index = 0; index < PromotionList.length; index++) {
            const element = PromotionList[index];
            let ListDish = element[1];
            let LishDishDetail = [];
            let totalPayment = 0;
            for (let i = 0; i < ListDish.length; i++) {
                const dish = ListDish[i];
                let resultDish = await DishService.FindOneById(dish.idmon);
                if (resultDish && resultDish.length > 0) {
                    resultDish[0].soluong = dish.soluong;
                    LishDishDetail.push(resultDish[0]);
                    totalPayment += resultDish[0].soluong * resultDish[0].gia;
                }
            }

            element[0][0].giamgia = ((totalPayment * element[0][0].giatrikhuyenmai) / 100)
            element[0][0].thanhtoan = totalPayment - element[0][0].giamgia;

            ListPromotionResult.push({
                khuyenmai: element[0][0],
                chitiet: LishDishDetail,
            });
        }
        return res.status(200).json(FormatResponseJson(200, "Successful", ListPromotionResult));
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
    if (req.hasOwnProperty('file')) {
        if (req.file.hasOwnProperty('filename')) {
            newPromotion.image = 'http://localhost:8000/images/' + req.file.filename;
        }
    } else {
        return res.status(400).json(FormatResponseJson(400, "Upload faild!", []));
    }

    //Fortmat list dish it and list dish quantity
    newPromotion.detailPromotion[0] = (newPromotion.detailPromotion[0]).toString().split(',');
    newPromotion.detailPromotion[1] = (newPromotion.detailPromotion[1]).toString().split(',');

    if (newPromotion.detailPromotion.length != 2) {
        return res.status(401).json(FormatResponseJson(401, "Detail promotion invalid, please check again!", []));
    } else {
        if (newPromotion.detailPromotion[0].length < 0 || newPromotion.detailPromotion[1].length < 0) {
            return res.status(401).json(FormatResponseJson(401, "Detail promotion invalid, please check again!", []));
        }
    }

    try {
        let idPromotionMax = await PromotionService.FindIdPromotionMax();

        //Custom Id Promotion
        idPromotionMax = idPromotionMax.substr(2, (idPromotionMax.length - 2));
        idPromotionMax = Number(idPromotionMax);

        let id = idPromotionMax + 1;
        newPromotion.idPromotion = "cb" + id;

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
    }

    try {
        let [promotion, promotionDetail] = await PromotionService.FindOneById(idPromotion);
        if (!promotion || promotion.length <= 0) {
            return res.status(404).json(FormatResponseJson(404, "Can not find promotion with this id promotion", []));
        } else {
            updatePromotion.image = promotion[0].hinhanh;
        }

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

const UploadBanner = async (req, res) => {
    let id = req.params.id;

    if (!id) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    }

    let image = '';
    if (req.hasOwnProperty('file')) {
        if (req.file.hasOwnProperty('filename')) {
            image = 'http://localhost:8000/images/' + req.file.filename;
        }
    } else {
        return res.status(400).json(FormatResponseJson(400, "Upload faild!", []));
    }

    try {
        let result = await PromotionService.UploadBanner(id, image);
        if (!result || result.length == 0) {
            return res.status(401).json(FormatResponseJson(401, "Update Promotion failed!", []));
        }
        return res.status(200).json(FormatResponseJson(200, "Updated Promotion successful!", [result]));
    } catch (error) {
        console.log(error);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}

export {
    GetPromotion,
    GetPromotionList,
    NewPromotion,
    UpdatePromotion,
    DeletePromotion,
    UploadBanner,
}
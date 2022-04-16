const BrandModel = require('../models/BrandModel')
const ApiError = require('../exceptions/api-error')

class BrandController{
    async create(req, res, next){
        //получение данных из тела запроса
        const {name} = req.body;
        const existingBrand = await BrandModel.findOne({name})
        if(existingBrand){
            return next(ApiError.BadRequest('такой брэнд уже существует'))
        }

        const newBrand = await BrandModel.create({name})
        return res.json({newBrand})
    }
    async delete(req, res, next){
        const {name} = req.body;
        const result = await BrandModel.deleteOne({name})
        if(result.deletedCount == 0){
            return next(ApiError.BadRequest('брэнд не найден'))
        }
        return res.json(result)
    }
    async update(req, res, next){
        const {name, newName} = req.body;
        const result = await BrandModel.updateOne({name}, {name: newName})
        if(result.matchedCount == 0){
            return next(ApiError.BadRequest('брэнд не найден'))
        }
        return res.json(result)
    }
    async getAll(req, res){
        const brands = await BrandModel.find().sort({name:'asc'})
        return res.json({brands})
    }

    async getOne(req, res){
        const {name} = req.body
        console.log(name)
        const brand = await BrandModel.findOne({name})
        return res.json({brand})
    }
}

module.exports = new BrandController()
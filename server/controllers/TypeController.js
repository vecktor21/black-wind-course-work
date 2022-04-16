const TypeModel = require('../models/TypeModel')
const ApiError = require('../exceptions/api-error')

class TypeController{
    async create(req, res, next){
        const {name} = req.body;
        console.log('name: ' + name)
        if(!name){
            return next(ApiError.BadRequest('название не передали'))
        }
        const existingType = await TypeModel.findOne({name})
        if(existingType){
            return next(ApiError.BadRequest('такой тип уже существует'))
        }

        const newType = await TypeModel.create({name})
        return res.json({newType})
    }
    async delete(req, res, next){
        const {name} = req.body;
        const result = await TypeModel.deleteOne({name})
        if(result.deletedCount == 0){
            return next(ApiError.BadRequest('тип не найден'))
        }
        return res.json(result)
    }
    async update(req, res, next){
        const {name, newName} = req.body;
        const result = await TypeModel.updateOne({name}, {name: newName})
        if(result.matchedCount == 0){
            return next(ApiError.BadRequest('тип не найден'))
        }
        return res.json(result)
    }
    async getAll(req, res){
        const types = await TypeModel.find().sort({name:'asc'})
        return res.json({types})
    }

    async getOne(req, res){
        const {name} = req.body
        console.log(name)
        const type = await TypeModel.findOne({name})
        return res.json({type})
    }
}

module.exports = new TypeController()
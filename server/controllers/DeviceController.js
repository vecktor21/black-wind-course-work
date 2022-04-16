const DeviceModel = require('../models/DeviceModel')
const BrandModel = require('../models/BrandModel')
const TypeModel = require('../models/TypeModel')
const ApieError = require('../exceptions/api-error')
const path = require('path')
const uuid = require('uuid')

class DeviceController{
    async create(req, res, next){
        try {
            const {name, price, description, brand, type} = req.body
            let {info}= req.body
            const {img} = req.files
            //поиск девайса в базе данных
            const device = await DeviceModel.findOne({name})

            if(device){
                return next(ApieError.BadRequest('товар уже существует'))
            }

            if(info.length > 0){
                info = JSON.parse(info)
            }else {
                info = [{title: '', value: ''}]
            }

            const imgName = uuid.v4() + '.jpg'
            img.mv(path.resolve(__dirname, '..', 'static', imgName))

            const brandId = await BrandModel.findOne({name: brand})
            const typeId = await TypeModel.findOne({name: type})

            if (!brandId || !typeId){
                return next(ApieError.BadRequest('бренд или тип не найден'))
            }
            const newDevice = await DeviceModel.create({
                name,
                price,
                info,
                img: imgName,
                description,
                brand: brandId._id,
                type: typeId._id
            })

            return res.json({newDevice})
        }catch (e) {
            console.log(e)
        }
    }
    async delete(req, res, next){
        const {id} = req.body
        const device = await DeviceModel.findById(id)
        if(!device){
            return next(ApieError.BadRequest('товар не найден'))
        }
        const result = await DeviceModel.deleteOne({_id: id})
        return res.json({result})
    }

    async update(req, res, next){
        try {
            const {id, newDeviceData} = req.body
            const filter = {_id: id}
            const update = {...newDeviceData}
            const options = {new: true}
            console.log("DeviceController: update: newDeviceData ", newDeviceData)
            const updatedDevice = await DeviceModel.findOneAndUpdate(filter, update, options)
            return res.json(updatedDevice)
        }catch (e) {
            next(e)
        }

    }
    async getAll(req, res){
        let {brand, type, page, limit} = req.query

        page = (Math.abs(page) || 1)-1
        limit = Math.abs(limit) || 5

        console.log('-----------------начало-------------------')
        console.log('deviceController: getAll: page: ', page)
        console.log('deviceController: getAll: limit: ', limit)

        console.log('deviceController: getAll: brand: ', brand)
        console.log('deviceController: getAll: type: ', type)


        let totalPages = 0;
        console.log('deviceController: getAll: totalPages: ', totalPages)
        let devices = []

        if(!brand && !type){
            console.log('deviceController: getAll: поиск всего')
            devices = await DeviceModel.find().limit(limit).skip(limit * page).sort({name:'asc'})
            totalPages = await DeviceModel.countDocuments()
        }
        else if(!brand && type){
            console.log('deviceController: getAll: поиск по типу')
            devices = await DeviceModel.find({type: type}).limit(limit).skip(limit * page).sort({name:'asc'})
            totalPages = await DeviceModel.countDocuments({type: type})
        }
        else if(brand && !type){
            console.log('deviceController: getAll: поиск по бренду')
            devices = await DeviceModel.find({brand: brand}).limit(limit).skip(limit * page).sort({name:'asc'})
            totalPages = await DeviceModel.countDocuments({brand: brand})
        }
        else if(brand && type){
            console.log('deviceController: getAll: поиск по типу и бренду')
            devices = await DeviceModel.find({brand: brand, type: type}).limit(limit).skip(limit * page).sort({name:'asc'})
            totalPages = await DeviceModel.countDocuments({brand: brand, type: type})
        }

        return res.json({devices, limit, totalPages: Math.ceil(totalPages/limit), totalDevices: totalPages, currentPage: page+1})
    }
    async getOne(req, res, next){
        try {
            const {id} = req.params
            const device = await DeviceModel.findById(id)
            if(!device){
                return next(ApieError.NotFound())
            }
            return res.json(device)
        }catch (e) {
            return next(ApieError.internal("не предвиденная ошибка"))
        }
    }
}

module.exports = new DeviceController()


//экспорт класса Schema и объекта model
const {model, Schema} = require('mongoose')
//создание схемы сущности Device
const deviceSchema = new Schema({
    //описание полей схемы
    name: {type: String, required: true},
    price: {type: Number, default: 0},
    img: {type: String, required: true},
    info: [{
        title: {type: String, required: true},
        value: {type: String, required: true}
    }],
    description: String,
    brand: {type: Schema.Types.ObjectId, ref: 'brand'},
    type: {type: Schema.Types.ObjectId, ref: 'type'}
})
//создание модели на основе схемы
module.exports = model('device', deviceSchema)


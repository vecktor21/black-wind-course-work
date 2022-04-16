const {model, Schema} = require('mongoose')

const orderModel = new Schema({
    email: {type: String, required: true},
    basketDevices: [{
        _id: {type: Schema.Types.ObjectId, ref: 'device'},
        name: String,
        price: Number,
        count: Number,
        description: String,
        totalPrice: Number
    }],
    total: Number
})

module.exports = model('order', orderModel)
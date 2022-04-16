const {model, Schema} = require('mongoose')

const brandModel = new Schema({
    name: {type: String, unique: true, required: true}
})

module.exports = model('brand', brandModel)
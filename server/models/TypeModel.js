const {model, Schema} = require('mongoose')

const typeModel = new Schema({
    name: {type: String, unique: true, required: true}
})

module.exports = model('type', typeModel)
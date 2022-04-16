const {model, Schema} = require('mongoose')

const tokenModel = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'user'},
    refreshToken: {type: String, required: true}
})

module.exports = model('token', tokenModel)
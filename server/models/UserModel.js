const {model, Schema} = require('mongoose')

const userModel = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    role: {type: String, required: true, default: "USER"},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String}
})

module.exports = model('user', userModel)
const TokenModel = require('../models/TokenModel')
const jwt = require('jsonwebtoken')
const ApiError = require('../exceptions/api-error')

class TokenService{
    generateTokens(payload){
        const accessToken = jwt.sign(payload, process.env.SECRET_CODE, {
            expiresIn:'24h'
        })
        const refreshToken = jwt.sign(payload, process.env.SECRET_CODE, {
            expiresIn:'30d'
        })
        return{
            accessToken,
            refreshToken
        }
    }
    async saveRefreshToken(userId, refreshToken){
        const tokenData = await TokenModel.findOne({userId})
        if(tokenData){
            tokenData.refreshToken = refreshToken
            const token = await tokenData.save()
            return token
        }
        const newTokenData = await TokenModel.create({userId, refreshToken})
        return newTokenData
    }
    async remove(refreshToken){
        const token = await TokenModel.deleteOne({refreshToken})
        return token
    }
    verifyToken(token){
        try {
            const tokenData = jwt.verify(token, process.env.SECRET_CODE)
            return tokenData
        }catch (e) {
            return null
        }
    }
    async findToken(refreshToken){
        const token = await TokenModel.findOne({refreshToken})
        return token
    }
}
module.exports = new TokenService()

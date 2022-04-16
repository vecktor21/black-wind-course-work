const ApiError = require('../exceptions/api-error')
const tokenService = require('../services/token-service')

module.exports =function (req, res, next) {
    if(req.method === 'OPTIONS'){
        next()
    }
    try {
        const authHeader = req.headers.authorization
        if(!authHeader){
            next(ApiError.UnauthorizedError())
        }
        const accessToken = authHeader.split(' ')[1]
        if(!accessToken){
            next(ApiError.UnauthorizedError())
        }
        const userData = tokenService.verifyToken(accessToken)

        if(!userData){
            next(ApiError.UnauthorizedError())
        }
        req.user = userData
        next()
    }catch (e) {
        next(ApiError.UnauthorizedError())
    }

}
const ApiError = require('../exceptions/api-error')
const tokenService = require('../services/token-service')

module.exports =function (role) {
    return function (req, res, next) {
        if(req.method === 'OPTIONS'){
            next()
        }
        try {
            const authHeader = req.headers.authorization
            const accessToken = authHeader.split(' ')[1]
            const userData = tokenService.verifyToken(accessToken)
            if (userData.role !== role){
                next(ApiError.forbidden("нет доступа"))
            }
            req.user = userData;
            next()
        }
        catch (e) {
            next(ApiError.internal("не предвиденная ошибка"))
        }
    }

}
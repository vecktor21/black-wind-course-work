const mailService = require('../services/mail-service')
const userService = require('../services/user-service')
const ApiError = require('../exceptions/api-error')
const UserModel = require('../models/UserModel')
const validator = require('express-validator')
class UserController {
    async registration(req, res, next){
        //валидация данных формы
        const errors = validator.validationResult(req)
        if(!errors.isEmpty()){
            return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
        }
        //получение данных из тела запроса
        const {email, password} = req.body
        //проверка: если пользователь с такой почтой уже зарегистрирован - получаем ошибку. в противном случае идем дальше
        const candidate = await UserModel.findOne({email})
        if (candidate){
            return next(ApiError.BadRequest("Пользователь с такой почтой уже зарегистрирован"))
        }
        //регистрация пользователя
        const userData = await userService.registration(email, password)
        //сохранение токена обновления авторизации в cookie файлы
        res.cookie('refreshToken', userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })
        return res.json(userData)
    }
    async login(req, res, next){
        try {
            const {email, password} = req.body
            const userData = await userService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })
            return res.json(userData)
        }catch (e) {
            next(e)
        }
    }
    async logout(req, res){
        const {refreshToken} = req.cookies
        const token = await userService.logout(refreshToken)
        res.clearCookie('refreshToken')
        res.clearCookie('accessToken')
        return res.json(token)
    }
    async updateUser(req, res){
        const {email} = req.body
        const subject = `Смена пароля`
        const link = `${process.env.CLIENT_URL}${process.env.PASSWORD_UPDATE_CONFIRM_ROUTE}`
        const html = `
                <div>
                    <h1>Смена пароля</h1>
                    <p>Вы запросили смену пароля на сайте "Черный Ветер"</p>
                    <p>Для смены пароля перейдите по ссылке ниже</p>
                    <a href="${link}">нажмите для смены пароля</a>
                    <p>Если вы не отправляли запрос на смены пароля, ничего не делайте</p>
                </div>
            `
        await mailService.sendEmail(email, subject, "", html)
        return res.json("сообщение для смены пароля было отправлено указанную на почту")
    }
    async changePassword(req, res, next){
        try {
            const {email, password, newPassword} = req.body
            const userData = await userService.changePassword(email, password, newPassword)
            return res.json(userData)
        }catch (e) {
            next(e)
        }
    }
    async activateUser(req, res, next){
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL+'/shop')
        }catch (e) {
            next(e)
        }
    }
    async refresh(req, res, next){
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })
            return res.json(userData)
        }catch (e) {
            next(e)
        }
    }
    async getAllUsers(req, res){
        const users = await UserModel.find()
        return res.json(users)
    }
    async getOneUser(req, res, next){
        const {id} = req.params
        const user = await UserModel.findById(id)
        if(!user){
            return next(ApiError.BadRequest("поьзователь не найден"))
        }
        return res.json(user)
    }

    async order(req, res, next){
        try {
            const {basket, email, total} = req.body
            console.log("UserController: order: email ", email)
            console.log("UserController: order: basket ", basket)
            await userService.order(email, basket, total)
            return res.json("товары заказаны")
        }catch (e) {
            console.log(e)
            next(e)
        }
    }
}

module.exports = new UserController()
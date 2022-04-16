const UserModel = require('../models/UserModel')
const DeviceModel = require('../models/DeviceModel')
const OrderModel = require('../models/OrderModel')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const tokenService = require('./token-service')
const mailService = require('./mail-service')
const UserDto = require('../dtos/UserDto')
const ApiError = require('../exceptions/api-error')

class UserService{
    async registration(email, password){
        try {
            const hashPassword = await bcrypt.hash(password, 5)
            const activationLink = uuid.v4()
            const role = 'USER'
            const userData = {
                email,
                password: hashPassword,
                activationLink,
                role,
                isActivated: false
            }
            const user = await UserModel.create(userData)
            const userDto = new UserDto(user)
            const tokens = tokenService.generateTokens({...userDto})
            await tokenService.saveRefreshToken(userDto.id, tokens.refreshToken)

            const subject = `Активация аккаунта`
            const link = `${process.env.API_URL}/api/user/activate/${activationLink}`
            const html = `
                <div>
                    <h1>Активация аккаунта</h1>
                    <p>Вы зарегестрировались на сайте "Черный Ветер"</p>
                    <p>Для активации аккаунта перейдите по ссылке ниже</p>
                    <a href="${link}">нажмите для активации</a>
                </div>
            `
            await mailService.sendEmail(email, subject, "", html)
            return {
                ...tokens,
                user: userDto
            }
        }catch (e) {
            console.log(e)
        }
    }
    async login(email, password){
        const user = await UserModel.findOne({email})
        if(!user){
            throw ApiError.BadRequest("пользователь с такой почтой не найден")
        }
        const isPassword = bcrypt.compareSync(password, user.password)
        if (!isPassword){
            throw ApiError.BadRequest("не правильный пароль")
        }
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveRefreshToken(userDto.id, tokens.refreshToken)
        return {
            ...tokens,
            user: userDto
        }
    }
    async logout(refreshToken){
        const token = tokenService.remove(refreshToken)
        return token
    }
    async changePassword(email, password, newPassword){
        const user = await UserModel.findOne({email})
        if(!user){
            throw ApiError.BadRequest("не верная почта")
        }
        const isPassword = bcrypt.compareSync(password, user.password)
        if (!isPassword){
            throw ApiError.BadRequest("не правильный пароль")
        }
        const newHashPass = await bcrypt.hash(newPassword, 5)
        user.password = newHashPass
        await user.save()
        const userData = new UserDto(user)
        return userData
    }
    async activate(activationLink){
        const user = await UserModel.findOne({activationLink})
        if(!user){
            throw ApiError.BadRequest("Некоректная ссылка активации")
        }
        user.isActivated = true
        await user.save()
    }
    async refresh(refreshToken){
        const userData = tokenService.verifyToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if(!userData || !tokenFromDb){
            throw ApiError.UnauthorizedError("пользователь не авторизован")
        }
        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user)
        const newTokens = tokenService.generateTokens({...userDto})
        await tokenService.saveRefreshToken(userData.id, newTokens.refreshToken)
        return {
            ...newTokens,
            user: userData
        }
    }
    async order(email, basket, total){
        const order = await OrderModel.create({
            email,
            basketDevices: basket,
            total: total
        })
        const subject = `Оформление заказа`
        const html = `
                <div>
                    <h1>Оформление заказа</h1>
                    <p>Вы оформили заказ на сайте "Черный Ветер"</p>
                    <p>Заказанные товары:</p>
                    ${basket.map(device =>
                        `<div>Товар: ${device.name}</div>
                         <div>Количество: ${device.count}</div>
                         <div>Цена за единицу: ${device.price}</div>
                         <div>Стоимость: ${device.price*device.count}</div>
                        `
                    )
                    }
                    <h3>Итого: ${total}тг</h3>
                </div>
            `
        await mailService.sendEmail(email, subject, "", html)
    }
}
module.exports = new UserService()
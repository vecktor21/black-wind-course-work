//создание дочернего роутера
const Router = require('express').Router;
const router = new Router()
//импорт соответствующего контроллера
const brandController = require('../controllers/BrandController')
//импорт промежуточного ПО проверки авторизации, регистрации и роли пользователя
const authMiddleware = require('../middleware/AuthMiddleware')
const accessMiddleware = require('../middleware/AccessMiddleware')
const emailActivatedMiddleware = require('../middleware/EmailActivatedMiddleware')
//непостредственно маршрутизация
router.post('/create',authMiddleware, emailActivatedMiddleware, accessMiddleware('ADMIN'), brandController.create)
router.post('/update',authMiddleware, emailActivatedMiddleware, accessMiddleware('ADMIN'), brandController.update)
router.post('/delete',authMiddleware, emailActivatedMiddleware, accessMiddleware('ADMIN'), brandController.delete)
router.get('/get', brandController.getAll)
router.post('/get', brandController.getOne)
//эекспорт файла
module.exports = router
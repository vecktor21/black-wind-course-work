//создание главного роутера
const Router = require('express');
const router = new Router()
//иморт дочерних роутеров
const userRouter = require('./UserRouter')
const deviceRouter = require('./DeviceRouter')
const typeRouter = require('./TypeRouter')
const brandRouter = require('./BrandRouter')
//маршрутизация
router.use('/user', userRouter)
router.use('/device', deviceRouter)
router.use('/type', typeRouter)
router.use('/brand', brandRouter)
//експорт файла
module.exports = router
const Router = require('express').Router;
const router = new Router()
const deviceController = require('../controllers/DeviceController')

const authMiddleware = require('../middleware/AuthMiddleware')
const accessMiddleware = require('../middleware/AccessMiddleware')
const emailActivatedMiddleware = require('../middleware/EmailActivatedMiddleware')

router.post('/create', authMiddleware, emailActivatedMiddleware, accessMiddleware('ADMIN'), deviceController.create)
router.post('/update', authMiddleware, emailActivatedMiddleware, accessMiddleware('ADMIN'), deviceController.update)
router.post('/delete', authMiddleware, emailActivatedMiddleware, accessMiddleware('ADMIN'), deviceController.delete)
router.get('/get', deviceController.getAll)
router.get('/get/:id', deviceController.getOne)


module.exports = router

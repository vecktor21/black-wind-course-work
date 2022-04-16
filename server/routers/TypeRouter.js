const Router = require('express').Router;
const router = new Router()
const typeController = require('../controllers/TypeController')

const authMiddleware = require('../middleware/AuthMiddleware')
const accessMiddleware = require('../middleware/AccessMiddleware')
const emailActivatedMiddleware = require('../middleware/EmailActivatedMiddleware')

router.post('/create', authMiddleware, emailActivatedMiddleware, accessMiddleware('ADMIN'),  typeController.create)
router.post('/update', authMiddleware, emailActivatedMiddleware, accessMiddleware('ADMIN'),  typeController.update)
router.post('/delete', authMiddleware, emailActivatedMiddleware, accessMiddleware('ADMIN'),  typeController.delete)
router.get('/get', typeController.getAll)
router.post('/get', typeController.getOne)


module.exports = router
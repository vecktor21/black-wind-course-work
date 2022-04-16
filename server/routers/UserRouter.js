const {body} = require('express-validator')
const Router = require('express').Router;
const userController = require('../controllers/UserController')
const router = new Router()

const authMiddleware = require('../middleware/AuthMiddleware')
const accessMiddleware = require('../middleware/AccessMiddleware')
const emailActivatedMiddleware = require('../middleware/EmailActivatedMiddleware')

router.post('/registration',
    body('email').isEmail(),
    userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.post('/update',authMiddleware, emailActivatedMiddleware, userController.updateUser)
router.post('/change-password', userController.changePassword)
router.get('/activate/:link', userController.activateUser)
router.get('/refresh', userController.refresh)
router.get('/', authMiddleware, userController.getAllUsers)
router.get('/:id', userController.getOneUser)
router.post('/order', userController.order)

module.exports = router
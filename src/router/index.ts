import {Router} from 'express'
import {userController} from '../controllers/user-controller'
import {body} from 'express-validator'
import authMiddleware from '../middleware/auth-middleware'

const router = Router()


router.post('/registration',
  body('email').isEmail(),
  body('password').isLength({min: 6, max: 32}),
  userController.registration)

router.post('/login', userController.login)

router.post('/logout', userController.logout)

router.post('/send-reset-email', userController.sendResetEmail)

router.post('/reset-password/:token', userController.resetPassword)

router.get('/activate/:link', userController.activate)

router.get('/refresh', userController.refresh)

router.get('/users', authMiddleware, userController.getUsers)

export default router

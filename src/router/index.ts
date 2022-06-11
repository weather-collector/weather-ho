import {Router} from 'express'
import {reportController} from '../controllers/report-controller'
import {userController} from '../controllers/user-controller'
import {body} from 'express-validator'
import authMiddleware from '../middleware/auth-middleware'

const router = Router()


router.post('/registration',
  body('email').isEmail(),
  body('password').isLength({min: 6, max: 32}),
  userController.registration)

router.post('/login', userController.login)

router.post('/google-auth', userController.googleAuth)

router.post('/logout', userController.logout)

router.post('/send-reset-email',
  body('email').isEmail(),
  userController.sendResetEmail)

router.post('/reset-password/:token', userController.resetPassword)

router.post('/update-password', authMiddleware, userController.updatePassword)

router.get('/activate/:link', userController.activate)

router.get('/refresh', userController.refresh)

router.get('/users', authMiddleware, userController.getUsers)

router.post('/generate-report', authMiddleware, reportController.generateReport)

router.get('/reports/:id', authMiddleware, reportController.getReport)

router.delete('/reports/:id', authMiddleware, reportController.deleteReport)

router.get('/reports', authMiddleware, reportController.getReports)

router.post('/send-email', authMiddleware, userController.sendEmail)

export default router

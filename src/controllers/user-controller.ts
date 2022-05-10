import {Request, Response, NextFunction} from 'express'
import {validationResult} from 'express-validator'
import ApiError from '../exceptions/api-error'
import {userService} from '../services/user-service'


const MONTH = 30 * 24 * 60 * 60 * 1000

class UserController {
  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation error', errors.array()))
      }
      const {email, password} = req.body
      const userData = await userService.registration({email, password})
      res.cookie('refreshToken', userData.refreshToken, {maxAge: MONTH, httpOnly: true, secure: false})
      return res.json(userData)
    } catch (error) {
      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const {email, password} = req.body
      const userData = await userService.login({email, password})
      res.cookie('refreshToken', userData.refreshToken, {maxAge: MONTH, httpOnly: true, secure: false})
      return res.json(userData)
    } catch (error) {
      next(error)
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const {refreshToken} = req.cookies
      const token = await userService.logout(refreshToken)
      res.clearCookie('refreshToken')
      return res.status(200).json(token)
    } catch (error) {
      next(error)
    }
  }

  async sendResetEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const {email} = req.body
      await userService.sendResetPasswordEmail(email)
      return res.status(200).json({message: `Email with instruction was successfully send to ${email}`})
    } catch (error) {
      next(error)
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = req.params.token
      const {password} = req.body
      await userService.resetPassword(accessToken, password)
      return res.status(200).json({message: `Your password was successfully updated`})
    } catch (error) {
      next(error)
    }
  }

  async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const activationLink = req.params.link
      await userService.activate(activationLink)
      return res.redirect(process.env.CLIENT_URL ?? '')
    } catch (error) {
      next(error)
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const {refreshToken} = req.cookies
      const userData = await userService.refresh(refreshToken)
      res.cookie('refreshToken', userData.refreshToken, {maxAge: MONTH, httpOnly: true, secure: false})
      return res.json(userData)
    } catch (error) {
      next(error)
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers()
      return res.json(users)
    } catch (error) {
      next(error)
    }
  }
}

export const userController = new UserController()
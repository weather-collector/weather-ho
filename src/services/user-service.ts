import bcrypt from 'bcrypt'
import {OAuth2Client} from "google-auth-library"
import {v4 as uuidv4} from 'uuid'
import UserDto from '../dtos/user-dto'
import ApiError from '../exceptions/api-error'
import {UserModel} from '../models/user-model'
import {mailService} from './mail-service'
import {IUserData, tokenService} from './token-service'


const googleClient = new OAuth2Client({
  clientId: `${process.env.GOOGLE_CLIENT_ID}`,
  clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
})

interface IUserService {
  email: string
  password: string
}

class UserService {
  async registration({email, password}: IUserService) {
    const candidate = await UserModel.findOne({email})
    if (candidate) {
      throw ApiError.BadRequest(`User with email ${email} already exists`)
    }
    const hashPassword = await bcrypt.hash(password, 3)
    const activationLink = uuidv4()

    const user = await UserModel.create({
      email,
      password: hashPassword,
      activationLink,
    })
    await mailService.sendActivationMail({to: email, link: `${process.env.API_URL}/api/activate/${activationLink}`})

    const userDto = new UserDto({email: user.email, _id: user.id, isActivated: user.isActivated, isAdmin: user.isAdmin}) // id, email, isActivated
    const accessToken = tokenService.generateAccessToken({...userDto})
    const refreshToken = tokenService.generateRefreshToken({...userDto})
    await tokenService.saveToken(userDto.id, refreshToken)

    return {
      accessToken,
      refreshToken,
      user: userDto,
    }
  }

  async activate(activationLink: string) {
    const user = await UserModel.findOne({activationLink})
    if (!user) {
      throw ApiError.BadRequest('Incorrect activation link')
    }
    user.isActivated = true
    await user.save()
  }

  async googleAuth(token: string) {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: `${process.env.GOOGLE_CLIENT_ID}`,
    })
    const payload = ticket.getPayload()
    if (!payload?.email) {
      throw ApiError.BadRequest('Google auth error')
    }

    let user = await UserModel.findOne({email: payload.email})
    if (!user) {
      const pass = uuidv4()
      const hashPassword = await bcrypt.hash(pass, 3)
      const activationLink = uuidv4()

      user = await UserModel.create({
        email: payload.email,
        password: hashPassword,
        isActivated: true,
        activationLink,
      })
      await mailService.sendGeneratedPassword(payload.email, pass)
    }

    const userDto = new UserDto({email: user.email, _id: user.id, isActivated: user.isActivated, isAdmin: user.isAdmin})
    const accessToken = tokenService.generateAccessToken({...userDto})
    const refreshToken = tokenService.generateRefreshToken({...userDto})
    await tokenService.saveToken(userDto.id, refreshToken)

    return {
      accessToken,
      refreshToken,
      user: userDto,
    }
  }

  async login({email, password}: IUserService) {
    const user = await UserModel.findOne({email})
    if (!user) {
      throw ApiError.BadRequest('Such user was not found')
    }
    const isPassEquals = await bcrypt.compare(password, user.password)
    if (!isPassEquals) {
      throw ApiError.BadRequest('Incorrect password')
    }
    const userDto = new UserDto({email: user.email, _id: user.id, isActivated: user.isActivated, isAdmin: user.isAdmin})
    const accessToken = tokenService.generateAccessToken({...userDto})
    const refreshToken = tokenService.generateRefreshToken({...userDto})
    await tokenService.saveToken(userDto.id, refreshToken)

    return {
      accessToken,
      refreshToken,
      user: userDto,
    }
  }

  async logout(refreshToken: string) {
    return await tokenService.removeToken(refreshToken)
  }

  async sendResetPasswordEmail(email: string) {
    const user = await UserModel.findOne({email})
    if (!user) {
      throw ApiError.BadRequest('Such user was not found')
    }
    const userDto = new UserDto({email: user.email, _id: user.id, isActivated: user.isActivated, isAdmin: user.isAdmin})
    const accessToken = tokenService.generateAccessToken({...userDto})

    await mailService.sendResetPasswordMail({to: email, link: `${process.env.CLIENT_URL}/restore-password/${accessToken}`})
  }

  async resetPassword(accessToken: string, password: string) {
    if (!accessToken) {
      throw ApiError.UnauthorizedError()
    }
    const userData: IUserData | null = tokenService.validateAccessToken(accessToken)
    if (!userData) {
      throw ApiError.UnauthorizedError()
    }
    const user = await UserModel.findById(userData.id)
    if (!user) {
      throw ApiError.UnauthorizedError()
    }
    user.password = await bcrypt.hash(password, 3)
    await user.save()
  }

  async updatePassword(newPassword: string, currentPassword: string, userData: IUserData) {
    const user = await UserModel.findById(userData.id)
    if (!user) {
      throw ApiError.UnauthorizedError()
    }
    const isPassEquals = await bcrypt.compare(currentPassword, user.password)
    if (!isPassEquals) {
      throw ApiError.BadRequest('Incorrect password')
    }
    user.password = await bcrypt.hash(newPassword, 3)
    await user.save()
  }

  async refresh(currentRefreshToken: string) {
    if (!currentRefreshToken) {
      throw ApiError.UnauthorizedError()
    }
    const userData: IUserData | null = tokenService.validateRefreshToken(currentRefreshToken)
    const tokenFromDB = await tokenService.findToken(currentRefreshToken)
    if (!userData || !tokenFromDB) {
      throw ApiError.UnauthorizedError()
    }

    const user = await UserModel.findById(userData.id)
    const userDto = new UserDto({
      email: user?.email ?? '',
      _id: user?.id ?? '',
      isActivated: user?.isActivated ?? false,
      isAdmin: user?.isAdmin ?? false,
    })
    const accessToken = tokenService.generateAccessToken({...userDto})
    const refreshToken = tokenService.generateRefreshToken({...userDto})
    await tokenService.saveToken(userDto.id, refreshToken)

    return {
      accessToken,
      refreshToken,
      user: userDto,
    }
  }

  async getAllUsers() {
    const users = await UserModel.find()
    return users
  }

  async sendEmail(theme: string, message: string, userData: IUserData) {
    try {
      await mailService.sendNotificationMail(theme, message, userData.email)
    } catch (e) {
      console.log(e)
    }

  }
}

export const userService = new UserService()

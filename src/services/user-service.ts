import UserDto from '../dtos/user-dto'
import {UserModel} from '../models/user-model'
import bcrypt from 'bcrypt'
import {v4 as uuidv4} from 'uuid'
import {mailService} from './mail-service'
import {IUserData, tokenService} from './token-service'
import ApiError from '../exceptions/api-error'


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
    const token = await tokenService.removeToken(refreshToken)
    return token
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
    const hashPassword = await bcrypt.hash(password, 3)
    user.password = hashPassword
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
}

export const userService = new UserService()

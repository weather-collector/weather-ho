import jwt, {JwtPayload} from 'jsonwebtoken'
import {TokenModel} from '../models/token-model'


export type PayloadProps = {
  email: string
  id: string
  isActivated: boolean
}

export interface IUserData extends JwtPayload {
  email: string
  id: string
  isActivated: boolean
}


class TokenService {
  generateAccessToken(payload: PayloadProps){
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET ?? '', {
      expiresIn: '30m'
    })
    return accessToken
  }

  generateRefreshToken(payload: PayloadProps){
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET ?? '', {
      expiresIn: '30d'
    })
    return refreshToken
  }

  validateAccessToken(token: string) {
    try {
      const userData = <IUserData>jwt.verify(token, process.env.JWT_ACCESS_SECRET ?? '')
      return userData
    } catch (error) {
      return null
    }
  }

  validateRefreshToken(token: string) {
    try {
      const userData = <IUserData>jwt.verify(token, process.env.JWT_REFRESH_SECRET ?? '')
      return userData
    } catch (error) {
      return null
    }
  }

  async saveToken(userId: string, refreshToken: string) {
    const tokenData = await TokenModel.findOne({user: userId})
    if (tokenData) {
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }
    const token = await TokenModel.create({
      user: userId,
      refreshToken
    })
    return token
  }

  async removeToken(refreshToken: string) {
    const tokenData = await TokenModel.deleteOne({refreshToken})
    return tokenData
  }

  async findToken(refreshToken: string) {
    const tokenData = await TokenModel.findOne({refreshToken})
    return tokenData
  }
}

export const tokenService = new TokenService()

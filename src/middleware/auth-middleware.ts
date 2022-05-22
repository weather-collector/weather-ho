import {NextFunction, Request, Response} from 'express'
import ApiError from '../exceptions/api-error'
import {IUserData, tokenService} from '../services/token-service'


export interface IGetUserAuthInfoRequest extends Request {
  user?: IUserData
}

export default function authMiddleware(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return next(ApiError.UnauthorizedError())
    }

    const accessToken = authHeader.split(' ')[1]
    if (!accessToken) {
      return next(ApiError.UnauthorizedError())
    }

    const userData = tokenService.validateAccessToken(accessToken)
    if (!userData) {
      return next(ApiError.UnauthorizedError())
    }

    req.user = userData
    next()
  } catch (e) {
    return next(ApiError.UnauthorizedError())
  }
}

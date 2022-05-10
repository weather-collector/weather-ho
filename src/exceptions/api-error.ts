import { ValidationError } from "express-validator"

export default class ApiError extends Error {
  status: number
  errors?: Error[] | ValidationError[]
  message!: string

  constructor(status: number, message: string, errors: Error[] | ValidationError[] = []) {
    super(message)
    this.status = status
    this.errors = errors
  }

  static UnauthorizedError() {
    return new ApiError(401, 'Not Authorized')
  }

  static BadRequest(message: string, errors: Error[] | ValidationError[] = []) {
    return new ApiError(400, message, errors)
  }

}

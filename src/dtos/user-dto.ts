interface IUserDto {
  email: string
  _id: string
  isActivated: boolean
  isAdmin: boolean
}

export default class UserDto {
  email
  id
  isActivated
  isAdmin

  constructor(model: IUserDto) {
    this.email = model.email
    this.id = model._id
    this.isActivated = model.isActivated
    this.isAdmin = model.isAdmin
  }
}


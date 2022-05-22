import {model, Schema, Model} from 'mongoose'

interface IUser {
  email: string;
  password: string;
  isActivated: boolean;
  isAdmin: boolean;
  activationLink: string;
  reports: Schema.Types.ObjectId;
  firstName?: string;
  lastName?: string;
}

const UserSchema: Schema = new Schema({
  email: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  isActivated: {type: Boolean, default: false},
  isAdmin: {type: Boolean, default: false},
  activationLink: {type: String},
  // reports: {type: Schema.Types.ObjectId, ref: 'Report'}, // ??
  firstName: {type: String},
  lastName: {type: String}
})

export const UserModel: Model<IUser> = model('User', UserSchema)

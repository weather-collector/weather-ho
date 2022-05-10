import {model, Schema, Model} from 'mongoose'

interface IToken {
  user: Schema.Types.ObjectId;
  refreshToken: string;
}

const TokenSchema: Schema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  refreshToken: {type: String, required: true}
})

export const TokenModel: Model<IToken> = model('Token', TokenSchema)

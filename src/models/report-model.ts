import {model, Schema, Model} from 'mongoose'
import {WeatherData} from '../dtos/report-dto'


export interface IReport {
  _id: string
  requestDate: string
  dateRange: string
  latitude: number
  longitude: number
  address: string
  weatherData: Array<WeatherData>
  user: Schema.Types.ObjectId
}

const ReportSchema: Schema = new Schema({
  requestDate: {type: Date, default: Date.now},
  dateRange: {type: String, required: true},
  latitude: {type: Number, required: true},
  longitude: {type: Number, required: true},
  address: {type: String, required: true},
  weatherData: {type: Array, required: true},
  user: {type: Schema.Types.ObjectId, ref: 'User'}
})

export const ReportModel: Model<IReport> = model('Report', ReportSchema)

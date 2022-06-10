export type WeatherData = {
  datetime: string,
  tempmax: number,
  tempmin: number,
  temp: number,
  dew: number,
  humidity: number,
  precip: number,
  precipcover: number,
  windspeed: number,
  winddir: number,
  pressure: number,
  cloudcover: number,
  solarradiation: number | null,
  solarenergy: number | null,
  uvIndex: number | null
}

interface IReportDto {
  _id: string
  requestDate: string
  dateRange: string
  latitude: number
  longitude: number
  address: string
  weatherData: Array<WeatherData>
}

export default class ReportDto {
  id
  requestDate
  dateRange
  latitude
  longitude
  address
  weatherData

  constructor(model: IReportDto) {
    this.id = model._id
    this.requestDate = model.requestDate
    this.dateRange = model.dateRange
    this.latitude = model.latitude
    this.longitude = model.longitude
    this.address = model.address
    this.weatherData = model.weatherData
  }
}


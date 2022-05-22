export type WeatherData = {
  datetime: string,
  tempMax: number,
  tempMin: number,
  temp: number,
  dew: number,
  humidity: number,
  precipitation: number,
  precipitationCover: number,
  windSpeed: number,
  windDir: number,
  pressure: number,
  cloudCover: number,
  solarRadiation: number | null,
  solarEnergy: number | null,
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


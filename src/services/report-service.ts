import axios, {AxiosError} from 'axios'
import ReportDto, {WeatherData} from '../dtos/report-dto'
import ApiError from '../exceptions/api-error'
import {IReport, ReportModel} from '../models/report-model'
import {dateRangeFormat} from '../utils/dateFormat'
import {IUserData} from './token-service'


export interface IReportService {
  latitude: number
  longitude: number
  dateRange: string
  locationName: string
  user: IUserData
}

const k = 5 / 18

class ReportService {
  async generateReport({latitude, longitude, dateRange, locationName, user}: IReportService) {
    const {dateFrom, dateTo} = dateRangeFormat(dateRange)
    try {
      const sameReports: IReport[] = await ReportModel.find({latitude, longitude, dateRange})

      if (sameReports.length !== 0) {
        const userIDs = sameReports.map(report => report.user)
        const currentUser = userIDs.filter(id => id.toString() === user.id)
        if (currentUser.length !== 0) {
          const report = await ReportModel.findOne({user: currentUser[0], latitude, longitude, dateRange})
          return {message: 'Ви уже маєте звіт згідно даної локації!', reportId: report?.id}
        }

        const  report = await ReportModel.create({
          dateRange: sameReports[0].dateRange,
          latitude: sameReports[0].latitude,
          longitude: sameReports[0].longitude,
          address: sameReports[0].address,
          weatherData: sameReports[0].weatherData,
          user: user.id,
        })
        return {message: 'Звіт був успішно сформований', reportId: report.id}
      }

      if (sameReports.length === 0) {
        const response = await axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude}%2C%20${longitude}/${dateFrom}/${dateTo}?unitGroup=metric&elements=datetime%2Cname%2CresolvedAddress%2Clatitude%2Clongitude%2Ctempmax%2Ctempmin%2Ctemp%2Cdew%2Chumidity%2Cprecip%2Cprecipcover%2Cwindspeed%2Cwinddir%2Cpressure%2Ccloudcover%2Csolarradiation%2Csolarenergy%2Cuvindex&include=obs%2Cdays&key=${process.env.VISUAL_CROSSING_KEY}&contentType=json`)
        const report = await ReportModel.create({
          dateRange: dateRange,
          latitude: latitude,
          longitude: longitude,
          address: locationName,
          weatherData: response.data.days.map((day: WeatherData) => ({...day, windspeed: day.windspeed * k})),
          user: user.id,
        })
        return {message: 'Звіт був успішно сформований', reportId: report.id}
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        return error.response?.data?.message
      } else {
        console.log(error)
      }
    }
  }

  async getSingleReport(reportId: string, user: IUserData) {
    const report: IReport | null = await ReportModel.findOne({user: user.id, _id: reportId})
    if (!report) {
      throw ApiError.BadRequest('Incorrect report id')
    }

    const reportDto = new ReportDto({
      _id: report._id,
      requestDate: new Date(report.requestDate).toLocaleString(),
      dateRange: report.dateRange,
      latitude: report.latitude,
      longitude: report.longitude,
      address: report.address,
      weatherData: report.weatherData,
    })

    return reportDto
  }

  async deleteSingleReport(reportId: string, user: IUserData) {
    const report = await ReportModel.deleteOne({user: user.id, _id: reportId})
    if (report.deletedCount === 1) {
      return `Звіт ${reportId} було успішно видалено`
    }
    return 'Звіту з таким id не існує'
  }


  async getAllReports(user: IUserData) {
    const reports = await ReportModel.find({user: user.id})
    return reports.map(report => (
      new ReportDto({
        _id: report._id,
        requestDate: new Date(report.requestDate).toLocaleString(),
        dateRange: report.dateRange,
        latitude: report.latitude,
        longitude: report.longitude,
        address: report.address,
        weatherData: report.weatherData,
      })
    )).reverse()
  }
}

export const reportService = new ReportService()

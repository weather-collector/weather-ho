import {NextFunction, Response} from 'express'
import {IGetUserAuthInfoRequest} from '../middleware/auth-middleware'
import {IReportService, reportService} from '../services/report-service'


class ReportController {
  async generateReport(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
    try {
      const {latitude, longitude, dateRange, locationName} = req.body
      const reportData = await reportService.generateReport(<IReportService>{
        latitude, longitude, dateRange, locationName, user: req.user
      })
      return res.json(reportData)
    } catch (error) {
      next(error)
    }
  }

  async getReport(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
    try {
      const reportId = req.params.id
      const reportData = await reportService.getSingleReport(reportId, req.user!)
      return res.json(reportData)
    } catch (error) {
      next(error)
    }
  }

  async deleteReport(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
    try {
      const reportId = req.params.id
      const message = await reportService.deleteSingleReport(reportId, req.user!)
      return res.json({message: message})
    } catch (error) {
      next(error)
    }
  }

  async getReports(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
    try {
      const reportsData = await reportService.getAllReports(req.user!)
      return res.json(reportsData)
    } catch (error) {
      next(error)
    }
  }
}

export const reportController = new ReportController()

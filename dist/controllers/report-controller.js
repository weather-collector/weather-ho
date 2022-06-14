"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportController = void 0;
const report_service_1 = require("../services/report-service");
class ReportController {
    generateReport(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { latitude, longitude, dateRange, locationName } = req.body;
                const reportData = yield report_service_1.reportService.generateReport({
                    latitude, longitude, dateRange, locationName, user: req.user
                });
                return res.json(reportData);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getReport(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reportId = req.params.id;
                const reportData = yield report_service_1.reportService.getSingleReport(reportId, req.user);
                return res.json(reportData);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteReport(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reportId = req.params.id;
                const message = yield report_service_1.reportService.deleteSingleReport(reportId, req.user);
                return res.json({ message: message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getReports(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reportsData = yield report_service_1.reportService.getAllReports(req.user);
                return res.json(reportsData);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.reportController = new ReportController();
//# sourceMappingURL=report-controller.js.map
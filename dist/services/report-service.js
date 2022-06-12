"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportService = void 0;
const axios_1 = __importStar(require("axios"));
const report_dto_1 = __importDefault(require("../dtos/report-dto"));
const api_error_1 = __importDefault(require("../exceptions/api-error"));
const report_model_1 = require("../models/report-model");
const dateFormat_1 = require("../utils/dateFormat");
const k = 5 / 18;
class ReportService {
    generateReport({ latitude, longitude, dateRange, locationName, user }) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { dateFrom, dateTo } = (0, dateFormat_1.dateRangeFormat)(dateRange);
            try {
                const sameReports = yield report_model_1.ReportModel.find({ latitude, longitude, dateRange });
                if (sameReports.length !== 0) {
                    const userIDs = sameReports.map(report => report.user);
                    const currentUser = userIDs.filter(id => id.toString() === user.id);
                    if (currentUser.length !== 0) {
                        const report = yield report_model_1.ReportModel.findOne({ user: currentUser[0], latitude, longitude, dateRange });
                        return { message: 'Ви уже маєте звіт згідно даної локації!', reportId: report === null || report === void 0 ? void 0 : report.id };
                    }
                    const report = yield report_model_1.ReportModel.create({
                        dateRange: sameReports[0].dateRange,
                        latitude: sameReports[0].latitude,
                        longitude: sameReports[0].longitude,
                        address: sameReports[0].address,
                        weatherData: sameReports[0].weatherData,
                        user: user.id,
                    });
                    return { message: 'Звіт був успішно сформований', reportId: report.id };
                }
                if (sameReports.length === 0) {
                    const response = yield axios_1.default.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude}%2C%20${longitude}/${dateFrom}/${dateTo}?unitGroup=metric&elements=datetime%2Cname%2CresolvedAddress%2Clatitude%2Clongitude%2Ctempmax%2Ctempmin%2Ctemp%2Cdew%2Chumidity%2Cprecip%2Cprecipcover%2Cwindspeed%2Cwinddir%2Cpressure%2Ccloudcover%2Csolarradiation%2Csolarenergy%2Cuvindex&include=obs%2Cdays&key=${process.env.VISUAL_CROSSING_KEY}&contentType=json`);
                    const report = yield report_model_1.ReportModel.create({
                        dateRange: dateRange,
                        latitude: latitude,
                        longitude: longitude,
                        address: locationName,
                        weatherData: response.data.days.map((day) => (Object.assign(Object.assign({}, day), { windspeed: day.windspeed * k }))),
                        user: user.id,
                    });
                    return { message: 'Звіт був успішно сформований', reportId: report.id };
                }
            }
            catch (error) {
                if (error instanceof axios_1.AxiosError) {
                    return (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message;
                }
                else {
                    console.log(error);
                }
            }
        });
    }
    getSingleReport(reportId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const report = yield report_model_1.ReportModel.findOne({ user: user.id, _id: reportId });
            if (!report) {
                throw api_error_1.default.BadRequest('Incorrect report id');
            }
            const reportDto = new report_dto_1.default({
                _id: report._id,
                requestDate: new Date(report.requestDate).toLocaleString(),
                dateRange: report.dateRange,
                latitude: report.latitude,
                longitude: report.longitude,
                address: report.address,
                weatherData: report.weatherData,
            });
            return reportDto;
        });
    }
    deleteSingleReport(reportId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const report = yield report_model_1.ReportModel.deleteOne({ user: user.id, _id: reportId });
            if (report.deletedCount === 1) {
                return `Звіт ${reportId} було успішно видалено`;
            }
            return 'Звіту з таким id не існує';
        });
    }
    getAllReports(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const reports = yield report_model_1.ReportModel.find({ user: user.id });
            return reports.map(report => (new report_dto_1.default({
                _id: report._id,
                requestDate: new Date(report.requestDate).toLocaleString(),
                dateRange: report.dateRange,
                latitude: report.latitude,
                longitude: report.longitude,
                address: report.address,
                weatherData: report.weatherData,
            }))).reverse();
        });
    }
}
exports.reportService = new ReportService();
//# sourceMappingURL=report-service.js.map
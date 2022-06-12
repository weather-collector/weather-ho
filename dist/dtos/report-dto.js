"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ReportDto {
    constructor(model) {
        this.id = model._id;
        this.requestDate = model.requestDate;
        this.dateRange = model.dateRange;
        this.latitude = model.latitude;
        this.longitude = model.longitude;
        this.address = model.address;
        this.weatherData = model.weatherData;
    }
}
exports.default = ReportDto;
//# sourceMappingURL=report-dto.js.map
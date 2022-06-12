"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportModel = void 0;
const mongoose_1 = require("mongoose");
const ReportSchema = new mongoose_1.Schema({
    requestDate: { type: Date, default: Date.now },
    dateRange: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true },
    weatherData: { type: Array, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }
});
exports.ReportModel = (0, mongoose_1.model)('Report', ReportSchema);
//# sourceMappingURL=report-model.js.map
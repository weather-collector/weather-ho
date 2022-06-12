"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateRangeFormat = void 0;
function dateRangeFormat(dateRange) {
    const dateFromArr = dateRange.substring(0, 10).split('.');
    const dateToArr = dateRange.substring(dateRange.length - 10).split('.');
    const dateFrom = `${dateFromArr[2]}-${dateFromArr[1]}-${dateFromArr[0]}`;
    const dateTo = `${dateToArr[2]}-${dateToArr[1]}-${dateToArr[0]}`;
    return { dateFrom, dateTo };
}
exports.dateRangeFormat = dateRangeFormat;
//# sourceMappingURL=dateFormat.js.map
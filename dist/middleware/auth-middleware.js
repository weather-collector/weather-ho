"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_error_1 = __importDefault(require("../exceptions/api-error"));
const token_service_1 = require("../services/token-service");
function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(api_error_1.default.UnauthorizedError());
        }
        const accessToken = authHeader.split(' ')[1];
        if (!accessToken) {
            return next(api_error_1.default.UnauthorizedError());
        }
        const userData = token_service_1.tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(api_error_1.default.UnauthorizedError());
        }
        req.user = userData;
        next();
    }
    catch (e) {
        return next(api_error_1.default.UnauthorizedError());
    }
}
exports.default = authMiddleware;
//# sourceMappingURL=auth-middleware.js.map
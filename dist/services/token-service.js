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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_model_1 = require("../models/token-model");
class TokenService {
    generateAccessToken(payload) {
        var _a;
        const accessToken = jsonwebtoken_1.default.sign(payload, (_a = process.env.JWT_ACCESS_SECRET) !== null && _a !== void 0 ? _a : '', {
            expiresIn: '15m'
        });
        return accessToken;
    }
    generateRefreshToken(payload) {
        var _a;
        const refreshToken = jsonwebtoken_1.default.sign(payload, (_a = process.env.JWT_REFRESH_SECRET) !== null && _a !== void 0 ? _a : '', {
            expiresIn: '7d'
        });
        return refreshToken;
    }
    validateAccessToken(token) {
        var _a;
        try {
            const userData = jsonwebtoken_1.default.verify(token, (_a = process.env.JWT_ACCESS_SECRET) !== null && _a !== void 0 ? _a : '');
            return userData;
        }
        catch (error) {
            return null;
        }
    }
    validateRefreshToken(token) {
        var _a;
        try {
            const userData = jsonwebtoken_1.default.verify(token, (_a = process.env.JWT_REFRESH_SECRET) !== null && _a !== void 0 ? _a : '');
            return userData;
        }
        catch (error) {
            return null;
        }
    }
    saveToken(userId, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = yield token_model_1.TokenModel.findOne({ user: userId });
            if (tokenData) {
                tokenData.refreshToken = refreshToken;
                return tokenData.save();
            }
            const token = yield token_model_1.TokenModel.create({
                user: userId,
                refreshToken
            });
            return token;
        });
    }
    removeToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = yield token_model_1.TokenModel.deleteOne({ refreshToken });
            return tokenData;
        });
    }
    findToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = yield token_model_1.TokenModel.findOne({ refreshToken });
            return tokenData;
        });
    }
}
exports.tokenService = new TokenService();
//# sourceMappingURL=token-service.js.map
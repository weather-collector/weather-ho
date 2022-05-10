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
exports.tokenService = void 0;
const jwt = require('jsonwebtoken');
const token_model_1 = require("../models/token-model");
class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: '30m'
        });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '30d'
        });
        return {
            accessToken,
            refreshToken
        };
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
}
exports.tokenService = new TokenService();
//# sourceMappingURL=token-service.js.map
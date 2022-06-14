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
exports.userController = void 0;
const express_validator_1 = require("express-validator");
const api_error_1 = __importDefault(require("../exceptions/api-error"));
const user_service_1 = require("../services/user-service");
const WEEK = 7 * 24 * 60 * 60 * 1000;
const cookieOptions = {
    maxAge: WEEK,
    httpOnly: true,
    secure: true,
    domain: process.env.NODE_ENV === 'production' ? `.${process.env.DOMAIN_NAME}` : undefined
};
class UserController {
    registration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return next(api_error_1.default.BadRequest('Validation error', errors.array()));
                }
                const { email, password } = req.body;
                const userData = yield user_service_1.userService.registration({ email, password });
                res.cookie('refreshToken', userData.refreshToken, cookieOptions);
                return res.json(userData);
            }
            catch (error) {
                next(error);
            }
        });
    }
    googleAuth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.body;
                const userData = yield user_service_1.userService.googleAuth(token);
                res.cookie('refreshToken', userData.refreshToken, cookieOptions);
                return res.json(userData);
            }
            catch (error) {
                next(error);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const userData = yield user_service_1.userService.login({ email, password });
                res.cookie('refreshToken', userData.refreshToken, cookieOptions);
                return res.json(userData);
            }
            catch (error) {
                next(error);
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.cookies;
                const token = yield user_service_1.userService.logout(refreshToken);
                res.clearCookie('refreshToken');
                return res.status(200).json(token);
            }
            catch (error) {
                next(error);
            }
        });
    }
    sendResetEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return next(api_error_1.default.BadRequest('Validation error', errors.array()));
                }
                const { email } = req.body;
                yield user_service_1.userService.sendResetPasswordEmail(email);
                return res.status(200).json({ message: `Email with instruction was successfully send to ${email}` });
            }
            catch (error) {
                next(error);
            }
        });
    }
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accessToken = req.params.token;
                const { password } = req.body;
                yield user_service_1.userService.resetPassword(accessToken, password);
                return res.status(200).json({ message: `Your password was successfully updated` });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updatePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { newPassword, currentPassword } = req.body;
                yield user_service_1.userService.updatePassword(newPassword, currentPassword, req.user);
                return res.status(200).json({ message: `Your password was successfully updated` });
            }
            catch (error) {
                next(error);
            }
        });
    }
    activate(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activationLink = req.params.link;
                yield user_service_1.userService.activate(activationLink);
                return res.redirect((_a = process.env.CLIENT_URL) !== null && _a !== void 0 ? _a : '');
            }
            catch (error) {
                next(error);
            }
        });
    }
    refresh(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.cookies;
                const userData = yield user_service_1.userService.refresh(refreshToken);
                res.cookie('refreshToken', userData.refreshToken, cookieOptions);
                return res.json(userData);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_service_1.userService.getAllUsers();
                return res.json(users);
            }
            catch (error) {
                next(error);
            }
        });
    }
    sendEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { theme, message } = req.body;
                yield user_service_1.userService.sendEmail(theme, message, req.user);
                return res.status(200).json({ message: `Your message was successfully delivered` });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.userController = new UserController();
//# sourceMappingURL=user-controller.js.map
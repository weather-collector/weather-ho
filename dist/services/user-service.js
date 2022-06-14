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
exports.userService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const google_auth_library_1 = require("google-auth-library");
const uuid_1 = require("uuid");
const user_dto_1 = __importDefault(require("../dtos/user-dto"));
const api_error_1 = __importDefault(require("../exceptions/api-error"));
const user_model_1 = require("../models/user-model");
const mail_service_1 = require("./mail-service");
const token_service_1 = require("./token-service");
const googleClient = new google_auth_library_1.OAuth2Client({
    clientId: `${process.env.GOOGLE_CLIENT_ID}`,
    clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
});
class UserService {
    registration({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = yield user_model_1.UserModel.findOne({ email });
            if (candidate) {
                throw api_error_1.default.BadRequest(`User with email ${email} already exists`);
            }
            const hashPassword = yield bcrypt_1.default.hash(password, 3);
            const activationLink = (0, uuid_1.v4)();
            const user = yield user_model_1.UserModel.create({
                email,
                password: hashPassword,
                activationLink,
            });
            yield mail_service_1.mailService.sendActivationMail({ to: email, link: `${process.env.API_URL}/api/activate/${activationLink}` });
            const userDto = new user_dto_1.default({ email: user.email, _id: user.id, isActivated: user.isActivated, isAdmin: user.isAdmin }); // id, email, isActivated
            const accessToken = token_service_1.tokenService.generateAccessToken(Object.assign({}, userDto));
            const refreshToken = token_service_1.tokenService.generateRefreshToken(Object.assign({}, userDto));
            yield token_service_1.tokenService.saveToken(userDto.id, refreshToken);
            return {
                accessToken,
                refreshToken,
                user: userDto,
            };
        });
    }
    activate(activationLink) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.UserModel.findOne({ activationLink });
            if (!user) {
                throw api_error_1.default.BadRequest('Incorrect activation link');
            }
            user.isActivated = true;
            yield user.save();
        });
    }
    googleAuth(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticket = yield googleClient.verifyIdToken({
                idToken: token,
                audience: `${process.env.GOOGLE_CLIENT_ID}`,
            });
            const payload = ticket.getPayload();
            if (!(payload === null || payload === void 0 ? void 0 : payload.email)) {
                throw api_error_1.default.BadRequest('Google auth error');
            }
            let user = yield user_model_1.UserModel.findOne({ email: payload.email });
            if (!user) {
                const pass = (0, uuid_1.v4)();
                const hashPassword = yield bcrypt_1.default.hash(pass, 3);
                const activationLink = (0, uuid_1.v4)();
                user = yield user_model_1.UserModel.create({
                    email: payload.email,
                    password: hashPassword,
                    isActivated: true,
                    activationLink,
                });
                yield mail_service_1.mailService.sendGeneratedPassword(payload.email, pass);
            }
            const userDto = new user_dto_1.default({ email: user.email, _id: user.id, isActivated: user.isActivated, isAdmin: user.isAdmin });
            const accessToken = token_service_1.tokenService.generateAccessToken(Object.assign({}, userDto));
            const refreshToken = token_service_1.tokenService.generateRefreshToken(Object.assign({}, userDto));
            yield token_service_1.tokenService.saveToken(userDto.id, refreshToken);
            return {
                accessToken,
                refreshToken,
                user: userDto,
            };
        });
    }
    login({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.UserModel.findOne({ email });
            if (!user) {
                throw api_error_1.default.BadRequest('Such user was not found');
            }
            const isPassEquals = yield bcrypt_1.default.compare(password, user.password);
            if (!isPassEquals) {
                throw api_error_1.default.BadRequest('Incorrect password');
            }
            const userDto = new user_dto_1.default({ email: user.email, _id: user.id, isActivated: user.isActivated, isAdmin: user.isAdmin });
            const accessToken = token_service_1.tokenService.generateAccessToken(Object.assign({}, userDto));
            const refreshToken = token_service_1.tokenService.generateRefreshToken(Object.assign({}, userDto));
            yield token_service_1.tokenService.saveToken(userDto.id, refreshToken);
            return {
                accessToken,
                refreshToken,
                user: userDto,
            };
        });
    }
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield token_service_1.tokenService.removeToken(refreshToken);
        });
    }
    sendResetPasswordEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.UserModel.findOne({ email });
            if (!user) {
                throw api_error_1.default.BadRequest('Such user was not found');
            }
            const userDto = new user_dto_1.default({ email: user.email, _id: user.id, isActivated: user.isActivated, isAdmin: user.isAdmin });
            const accessToken = token_service_1.tokenService.generateAccessToken(Object.assign({}, userDto));
            yield mail_service_1.mailService.sendResetPasswordMail({ to: email, link: `${process.env.CLIENT_URL}/restore-password/${accessToken}` });
        });
    }
    resetPassword(accessToken, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!accessToken) {
                throw api_error_1.default.UnauthorizedError();
            }
            const userData = token_service_1.tokenService.validateAccessToken(accessToken);
            if (!userData) {
                throw api_error_1.default.UnauthorizedError();
            }
            const user = yield user_model_1.UserModel.findById(userData.id);
            if (!user) {
                throw api_error_1.default.UnauthorizedError();
            }
            user.password = yield bcrypt_1.default.hash(password, 3);
            yield user.save();
        });
    }
    updatePassword(newPassword, currentPassword, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.UserModel.findById(userData.id);
            if (!user) {
                throw api_error_1.default.UnauthorizedError();
            }
            const isPassEquals = yield bcrypt_1.default.compare(currentPassword, user.password);
            if (!isPassEquals) {
                throw api_error_1.default.BadRequest('Incorrect password');
            }
            user.password = yield bcrypt_1.default.hash(newPassword, 3);
            yield user.save();
        });
    }
    refresh(currentRefreshToken) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            if (!currentRefreshToken) {
                throw api_error_1.default.UnauthorizedError();
            }
            const userData = token_service_1.tokenService.validateRefreshToken(currentRefreshToken);
            const tokenFromDB = yield token_service_1.tokenService.findToken(currentRefreshToken);
            if (!userData || !tokenFromDB) {
                throw api_error_1.default.UnauthorizedError();
            }
            const user = yield user_model_1.UserModel.findById(userData.id);
            const userDto = new user_dto_1.default({
                email: (_a = user === null || user === void 0 ? void 0 : user.email) !== null && _a !== void 0 ? _a : '',
                _id: (_b = user === null || user === void 0 ? void 0 : user.id) !== null && _b !== void 0 ? _b : '',
                isActivated: (_c = user === null || user === void 0 ? void 0 : user.isActivated) !== null && _c !== void 0 ? _c : false,
                isAdmin: (_d = user === null || user === void 0 ? void 0 : user.isAdmin) !== null && _d !== void 0 ? _d : false,
            });
            const accessToken = token_service_1.tokenService.generateAccessToken(Object.assign({}, userDto));
            const refreshToken = token_service_1.tokenService.generateRefreshToken(Object.assign({}, userDto));
            yield token_service_1.tokenService.saveToken(userDto.id, refreshToken);
            return {
                accessToken,
                refreshToken,
                user: userDto,
            };
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield user_model_1.UserModel.find();
            return users;
        });
    }
    sendEmail(theme, message, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mail_service_1.mailService.sendNotificationMail(theme, message, userData.email);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}
exports.userService = new UserService();
//# sourceMappingURL=user-service.js.map
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
const user_dto_1 = __importDefault(require("../dtos/user-dto"));
const user_model_1 = require("../models/user-model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const mail_service_1 = require("./mail-service");
const token_service_1 = require("./token-service");
class UserService {
    registration({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = yield user_model_1.UserModel.findOne({ email });
            if (candidate) {
                throw new Error(`User with email ${email} already exists`);
            }
            const hashPassword = yield bcrypt_1.default.hash(password, 3);
            const activationLink = (0, uuid_1.v4)();
            const user = yield user_model_1.UserModel.create({
                email,
                password: hashPassword,
                activationLink,
            });
            yield mail_service_1.mailService.sendActivationMail({ to: email, link: `${process.env.API_URL}/api/activation/${activationLink}` });
            const userDto = new user_dto_1.default({ email: user.email, _id: user.id, isActivated: user.isActivated }); // id, email, isActivated
            const tokens = token_service_1.tokenService.generateTokens(Object.assign({}, userDto));
            yield token_service_1.tokenService.saveToken(userDto.id, tokens.refreshToken);
            return Object.assign(Object.assign({}, tokens), { user: userDto });
        });
    }
}
exports.userService = new UserService();
//# sourceMappingURL=user-service.js.map
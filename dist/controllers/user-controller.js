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
exports.userController = void 0;
const user_service_1 = require("../services/user-service");
const MONTH = 30 * 24 * 60 * 60 * 1000;
class UserController {
    registration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const userData = yield user_service_1.userService.registration({ email, password });
                res.cookie('refreshToken', userData.refreshToken, { maxAge: MONTH, httpOnly: true, secure: true });
                return res.json(userData);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (e) {
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (e) {
            }
        });
    }
    activate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (e) {
            }
        });
    }
    refresh(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (e) {
            }
        });
    }
    getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.json(['123']).status(200);
            }
            catch (e) {
            }
        });
    }
}
exports.userController = new UserController();
//# sourceMappingURL=user-controller.js.map
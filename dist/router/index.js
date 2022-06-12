"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const report_controller_1 = require("../controllers/report-controller");
const user_controller_1 = require("../controllers/user-controller");
const express_validator_1 = require("express-validator");
const auth_middleware_1 = __importDefault(require("../middleware/auth-middleware"));
const router = (0, express_1.Router)();
router.post('/registration', (0, express_validator_1.body)('email').isEmail(), (0, express_validator_1.body)('password').isLength({ min: 6, max: 32 }), user_controller_1.userController.registration);
router.post('/login', user_controller_1.userController.login);
router.post('/google-auth', user_controller_1.userController.googleAuth);
router.post('/logout', user_controller_1.userController.logout);
router.post('/send-reset-email', (0, express_validator_1.body)('email').isEmail(), user_controller_1.userController.sendResetEmail);
router.post('/reset-password/:token', user_controller_1.userController.resetPassword);
router.post('/update-password', auth_middleware_1.default, user_controller_1.userController.updatePassword);
router.get('/activate/:link', user_controller_1.userController.activate);
router.get('/refresh', user_controller_1.userController.refresh);
router.get('/users', auth_middleware_1.default, user_controller_1.userController.getUsers);
router.post('/generate-report', auth_middleware_1.default, report_controller_1.reportController.generateReport);
router.get('/reports/:id', auth_middleware_1.default, report_controller_1.reportController.getReport);
router.delete('/reports/:id', auth_middleware_1.default, report_controller_1.reportController.deleteReport);
router.get('/reports', auth_middleware_1.default, report_controller_1.reportController.getReports);
router.post('/send-email', auth_middleware_1.default, user_controller_1.userController.sendEmail);
exports.default = router;
//# sourceMappingURL=index.js.map
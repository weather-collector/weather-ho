"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user-controller");
const router = (0, express_1.Router)();
router.post('/registration', user_controller_1.userController.registration);
router.post('/login', user_controller_1.userController.login);
router.post('/logout', user_controller_1.userController.logout);
router.get('/activate/:link', user_controller_1.userController.activate);
router.get('/refresh', user_controller_1.userController.refresh);
router.get('/users', user_controller_1.userController.getUsers);
exports.default = router;
//# sourceMappingURL=index.js.map
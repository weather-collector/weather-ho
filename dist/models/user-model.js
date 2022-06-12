"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    activationLink: { type: String },
    // reports: {type: Schema.Types.ObjectId, ref: 'Report'}, // ??
    firstName: { type: String },
    lastName: { type: String }
});
exports.UserModel = (0, mongoose_1.model)('User', UserSchema);
//# sourceMappingURL=user-model.js.map
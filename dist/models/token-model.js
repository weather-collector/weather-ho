"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenModel = void 0;
const mongoose_1 = require("mongoose");
const TokenSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    refreshToken: { type: String, required: true }
});
exports.TokenModel = (0, mongoose_1.model)('Token', TokenSchema);
//# sourceMappingURL=token-model.js.map
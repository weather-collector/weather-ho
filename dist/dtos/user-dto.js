"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserDto {
    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
    }
}
exports.default = UserDto;
//# sourceMappingURL=user-dto.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.existedUser = void 0;
const user_model_1 = require("./user.model");
const existedUser = async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        next({ message: "Please fill all the fields", status: 404 });
    }
    const isUserAlreadyExist = await user_model_1.User.findOne({ email });
    if (isUserAlreadyExist) {
        return next({ message: "User already exist with this mail", status: 404 });
    }
    next();
};
exports.existedUser = existedUser;
//# sourceMappingURL=user.middleware.js.map
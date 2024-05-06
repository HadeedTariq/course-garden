"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowecase: true,
        trim: true,
    },
    avatar: {
        type: String,
        required: false,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRhtuszppVVNDg2JDHofrs55RtFKjd8I9vNU_wzl2CMA&s",
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    qualification: {
        type: String,
        required: [true, "Qualification is required"],
    },
    points: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "CoursePoints",
    },
    refreshToken: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ["student", "teacher", "admin"],
        default: "student",
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true,
    },
    country: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["member", "pro"],
        default: "member",
    },
}, {
    timestamps: true,
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = await bcrypt_1.default.hash(this.password, 10);
    next();
});
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt_1.default.compare(password, this.password);
};
userSchema.methods.generateAccessAndRefreshToken = function () {
    const refreshToken = jsonwebtoken_1.default.sign({ id: this._id }, process.env.JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: "15d",
    });
    const accessToken = jsonwebtoken_1.default.sign({
        id: this._id,
        username: this.username,
        email: this.email,
        status: this.status,
        role: this.role,
        avatar: this.avatar,
    }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: "2d" });
    return { refreshToken, accessToken };
};
exports.User = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=user.model.js.map
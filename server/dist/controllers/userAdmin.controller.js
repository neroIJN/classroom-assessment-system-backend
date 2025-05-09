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
exports.updateUserAdminProfileController = exports.updateUserPasswordController = exports.getAdminInfo = exports.updateAccessToken = exports.logoutUser = exports.loginUser = exports.activateUser = exports.createActivationToken = exports.registrationUser = void 0;
require("dotenv").config();
const userAdmin_model_1 = __importDefault(require("../models/userAdmin.model"));
const ErrorHandler_1 = require("../utils/ErrorHandler");
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const jwt_1 = require("../utils/jwt");
const redis_1 = require("../utils/redis");
const userAdmin_service_1 = require("../services/userAdmin.service");
exports.registrationUser = (0, catchAsyncError_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, avatar } = req.body;
        const isEmailExist = yield userAdmin_model_1.default.findOne({ email });
        if (isEmailExist) {
            return next(new ErrorHandler_1.ErrorHandler("Email already exists", 400));
        }
        const user = {
            name,
            email,
            password,
            avatar
        };
        const activationToken = (0, exports.createActivationToken)(user);
        const activationCode = activationToken.activationCode;
        const data = { user: { name: user.name }, activationCode };
        const html = yield ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/activation-mail.ejs"), data);
        try {
            yield (0, sendMail_1.default)({
                email: user.email,
                subject: "Activate your account",
                template: "activation-mail.ejs",
                data,
            });
            res.status(201).json({
                success: true,
                message: `Please check your email: ${user.email} to activate your account!`,
                activationToken: activationToken.token,
            });
        }
        catch (error) {
            return next(new ErrorHandler_1.ErrorHandler(error.message, 400));
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.ErrorHandler(error.message, 400));
    }
}));
const createActivationToken = (user) => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jsonwebtoken_1.default.sign({
        user,
        activationCode,
    }, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m",
    });
    return { token, activationCode };
};
exports.createActivationToken = createActivationToken;
exports.activateUser = (0, catchAsyncError_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { activation_token, activation_code } = req.body;
        const newUser = jsonwebtoken_1.default.verify(activation_token, process.env.ACTIVATION_SECRET);
        if (newUser.activationCode !== activation_code) {
            return next(new ErrorHandler_1.ErrorHandler("Invalid activation code", 400));
        }
        const { name, email, password, avatar } = newUser.user;
        const existUser = yield userAdmin_model_1.default.findOne({ email });
        if (existUser) {
            return next(new ErrorHandler_1.ErrorHandler("Email already exists", 400));
        }
        const user = yield userAdmin_model_1.default.create({
            name,
            email,
            password,
            avatar,
            role: "admin",
            isVerified: true,
            courses: []
        });
        res.status(201).json({
            success: true,
            message: "Account activated successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.ErrorHandler(error.message, 400));
    }
}));
exports.loginUser = (0, catchAsyncError_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler_1.ErrorHandler("Please enter email and password", 400));
        }
        const user = yield userAdmin_model_1.default
            .findOne({ email, role: "admin" })
            .select("+password");
        if (!user) {
            return next(new ErrorHandler_1.ErrorHandler("Invalid email or password", 400));
        }
        const isPasswordMatch = yield user.comparePassword(password);
        if (!isPasswordMatch) {
            return next(new ErrorHandler_1.ErrorHandler("Invalid email or password", 400));
        }
        (0, jwt_1.sendToken)(user, 200, res);
    }
    catch (error) {
        return next(new ErrorHandler_1.ErrorHandler(error.message, 400));
    }
}));
// logout user
exports.logoutUser = (0, catchAsyncError_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        res.cookie("access_token", "", { maxAge: 1 });
        res.cookie("refresh_token", "", { maxAge: 1 });
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) || "";
        if (typeof userId === "string" && userId.length > 0) {
            yield redis_1.redis.del(userId);
        }
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.ErrorHandler(error.message, 400));
    }
}));
// update access token
exports.updateAccessToken = (0, catchAsyncError_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refresh_token = req.cookies.refresh_token;
        if (!refresh_token) {
            return next(new ErrorHandler_1.ErrorHandler("No refresh token provided", 400));
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(refresh_token, process.env.REFRESH_TOKEN);
        }
        catch (error) {
            return next(new ErrorHandler_1.ErrorHandler("Invalid or expired refresh token", 400));
        }
        if (!decoded || !decoded.id) {
            return next(new ErrorHandler_1.ErrorHandler("Invalid token payload", 400));
        }
        const session = yield redis_1.redis.get(decoded.id);
        if (!session) {
            return next(new ErrorHandler_1.ErrorHandler("Please login to access this resource", 401));
        }
        const user = JSON.parse(session);
        // Verify user is an admin
        if (user.role !== "admin") {
            return next(new ErrorHandler_1.ErrorHandler("Access denied: Admin privileges required", 403));
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.ACCESS_TOKEN, {
            expiresIn: "5m",
        });
        const newRefreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.REFRESH_TOKEN, {
            expiresIn: "3d",
        });
        req.user = user;
        res.cookie("access_token", accessToken, jwt_1.accessTokenOptions);
        res.cookie("refresh_token", newRefreshToken, jwt_1.refreshTokenOptions);
        // Extend session expiration in Redis
        yield redis_1.redis.set(user._id, JSON.stringify(user), "EX", 604800); // 7 days
        res.status(200).json({
            success: true,
            accessToken,
            refreshToken: newRefreshToken,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.ErrorHandler(error.message, 500));
    }
}));
// get admin info
exports.getAdminInfo = (0, catchAsyncError_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (typeof userId === 'string') {
            const user = yield userAdmin_model_1.default.findById(userId);
            if (!user || user.role !== "admin") {
                return next(new ErrorHandler_1.ErrorHandler("Admin not found", 404));
            }
            (0, userAdmin_service_1.getUserById)(userId, res);
        }
        else {
            return next(new ErrorHandler_1.ErrorHandler("Invalid user ID", 400));
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.ErrorHandler(error.message, 400));
    }
}));
// update user password
exports.updateUserPasswordController = (0, catchAsyncError_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (typeof userId === 'string') {
            const user = yield userAdmin_model_1.default.findById(userId).select("+password");
            if (!user) {
                return next(new ErrorHandler_1.ErrorHandler("User not found", 404));
            }
            const isPasswordMatch = yield user.comparePassword(oldPassword);
            if (!isPasswordMatch) {
                return next(new ErrorHandler_1.ErrorHandler("Old password is incorrect", 400));
            }
            user.password = newPassword;
            yield user.save();
            res.status(200).json({
                success: true,
                message: "Password updated successfully",
            });
        }
        else {
            return next(new ErrorHandler_1.ErrorHandler("Invalid user ID", 400));
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.ErrorHandler(error.message, 400));
    }
}));
// update user profile
const updateUserAdminProfileController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, email } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (typeof userId === 'string') {
            const user = yield userAdmin_model_1.default.findById(userId);
            if (!user) {
                return next(new ErrorHandler_1.ErrorHandler("User not found", 404));
            }
            user.name = name || user.name;
            user.email = email || user.email;
            const updateResult = yield (0, userAdmin_service_1.updateUserService)(userId, req.body);
            res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                updateResult,
            });
        }
        else {
            return next(new ErrorHandler_1.ErrorHandler("Invalid user ID", 400));
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.ErrorHandler(error.message, 400));
    }
});
exports.updateUserAdminProfileController = updateUserAdminProfileController;

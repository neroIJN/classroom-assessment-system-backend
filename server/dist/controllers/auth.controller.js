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
exports.resetPassword = exports.verifyResetToken = exports.forgotPassword = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const ErrorHandler_1 = require("../utils/ErrorHandler");
const userAdmin_model_1 = __importDefault(require("../models/userAdmin.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const redis_1 = require("../utils/redis");
exports.forgotPassword = (0, catchAsyncError_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield userAdmin_model_1.default.findOne({ email });
        if (!user) {
            return next(new ErrorHandler_1.ErrorHandler("User not found", 404));
        }
        // Generate reset token
        const resetToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.RESET_PASSWORD_SECRET, {
            expiresIn: "15m",
        });
        // Generate reset code
        const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
        // Store reset info in Redis
        yield redis_1.redis.set(`resetPassword:${resetToken}`, JSON.stringify({
            userId: user._id,
            resetCode
        }), "EX", 900); // 15 minutes
        const data = {
            user: {
                name: user.name
            },
            resetCode
        };
        try {
            yield (0, sendMail_1.default)({
                email: user.email,
                subject: "Reset Your Password",
                template: "reset-password-mail.ejs",
                data,
            });
            res.status(200).json({
                success: true,
                message: "Password reset instructions sent to your email",
                resetToken
            });
        }
        catch (error) {
            yield redis_1.redis.del(`resetPassword:${resetToken}`);
            return next(new ErrorHandler_1.ErrorHandler(error.message, 400));
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.ErrorHandler(error.message, 400));
    }
}));
exports.verifyResetToken = (0, catchAsyncError_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Changed from req.body to req.query since it's a GET request
        const { resetToken, resetCode } = req.query;
        if (!resetToken || !resetCode) {
            return next(new ErrorHandler_1.ErrorHandler("Reset token and code are required", 400));
        }
        const resetInfo = yield redis_1.redis.get(`resetPassword:${resetToken}`);
        if (!resetInfo) {
            return next(new ErrorHandler_1.ErrorHandler("Reset token is invalid or has expired", 400));
        }
        const { resetCode: storedCode } = JSON.parse(resetInfo);
        if (resetCode !== storedCode) {
            return next(new ErrorHandler_1.ErrorHandler("Invalid reset code", 400));
        }
        res.status(200).json({
            success: true,
            message: "Reset token verified successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.ErrorHandler(error.message, 400));
    }
}));
exports.resetPassword = (0, catchAsyncError_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { resetToken, newPassword } = req.body;
        const resetInfo = yield redis_1.redis.get(`resetPassword:${resetToken}`);
        if (!resetInfo) {
            return next(new ErrorHandler_1.ErrorHandler("Reset token is invalid or has expired", 400));
        }
        const { userId } = JSON.parse(resetInfo);
        const user = yield userAdmin_model_1.default.findById(userId).select("+password");
        if (!user) {
            return next(new ErrorHandler_1.ErrorHandler("User not found", 404));
        }
        // Update password
        user.password = newPassword;
        yield user.save();
        // Delete reset token from Redis
        yield redis_1.redis.del(`resetPassword:${resetToken}`);
        res.status(200).json({
            success: true,
            message: "Password reset successful"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.ErrorHandler(error.message, 400));
    }
}));

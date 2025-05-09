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
exports.errorMiddleware = exports.checkFeedbackExists = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ErrorHandler_1 = require("../utils/ErrorHandler");
const feedback_model_1 = __importDefault(require("../models/feedback.model"));
const checkFeedbackExists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return next(new ErrorHandler_1.ErrorHandler('Invalid feedback ID', 400));
        }
        const feedback = yield feedback_model_1.default.findById(id);
        if (!feedback) {
            return next(new ErrorHandler_1.ErrorHandler('Feedback not found', 404));
        }
        // req.feedback = feedback;
        next();
    }
    catch (error) {
        next(new ErrorHandler_1.ErrorHandler(error.message, 500));
    }
});
exports.checkFeedbackExists = checkFeedbackExists;
const errorMiddleware = (err, req, res, next) => {
    const statusCode = err instanceof ErrorHandler_1.ErrorHandler ? err.statusCode : 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        message,
    });
};
exports.errorMiddleware = errorMiddleware;

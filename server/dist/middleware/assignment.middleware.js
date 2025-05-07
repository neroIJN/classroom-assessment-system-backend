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
exports.validateQuizSubmission = exports.errorMiddleware = exports.validateAssignmentInput = exports.checkAssignmentAvailability = exports.checkAssignmentExists = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mcq_model_1 = __importDefault(require("../models/mcq.model"));
const ErrorHandler_1 = require("../utils/ErrorHandler");
const checkAssignmentExists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return next(new ErrorHandler_1.ErrorHandler('Invalid assignment ID', 400));
        }
        const assignment = yield mcq_model_1.default.findById(id);
        if (!assignment) {
            return next(new ErrorHandler_1.ErrorHandler('Assignment not found', 404));
        }
        req.assignment = assignment;
        next();
    }
    catch (error) {
        next(new ErrorHandler_1.ErrorHandler(error.message, 500));
    }
});
exports.checkAssignmentExists = checkAssignmentExists;
const checkAssignmentAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assignment = req.assignment;
        const currentDate = new Date();
        if (!assignment) {
            return next(new ErrorHandler_1.ErrorHandler('Assignment not found', 404));
        }
        // Check if the current date is within the assignment's availability period
        if (currentDate < assignment.startDate) {
            return next(new ErrorHandler_1.ErrorHandler('This assignment is not yet available', 403));
        }
        if (currentDate > assignment.endDate) {
            return next(new ErrorHandler_1.ErrorHandler('This assignment has expired', 403));
        }
        next();
    }
    catch (error) {
        next(new ErrorHandler_1.ErrorHandler(error.message, 500));
    }
});
exports.checkAssignmentAvailability = checkAssignmentAvailability;
const validateAssignmentInput = (req, res, next) => {
    const { title, description, questions, timeLimit, startDate, endDate } = req.body;
    // Basic validation
    if (!title || !description || !questions || !timeLimit || !startDate || !endDate) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields'
        });
    }
    // Validate date format and logic
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const now = new Date();
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format'
            });
        }
        if (start >= end) {
            return res.status(400).json({
                success: false,
                message: 'End date must be after start date'
            });
        }
        if (start < now && req.method === 'POST') {
            return res.status(400).json({
                success: false,
                message: 'Start date cannot be in the past for new assignments'
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Invalid date format'
        });
    }
    next();
};
exports.validateAssignmentInput = validateAssignmentInput;
const errorMiddleware = (err, req, res, next) => {
    const statusCode = err instanceof ErrorHandler_1.ErrorHandler ? err.statusCode : 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        message,
    });
};
exports.errorMiddleware = errorMiddleware;
const validateQuizSubmission = (req, res, next) => {
    const { userId, answers, startTime } = req.body;
    const assignmentId = req.params.id;
    if (!userId || !assignmentId || !answers || !startTime) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: userId, assignmentId, answers, or startTime'
        });
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(userId) || !mongoose_1.default.Types.ObjectId.isValid(assignmentId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid userId or assignmentId format'
        });
    }
    if (!Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Answers must be a non-empty array'
        });
    }
    const isValidAnswers = answers.every(answer => answer.questionId &&
        answer.selectedOption &&
        mongoose_1.default.Types.ObjectId.isValid(answer.questionId) &&
        mongoose_1.default.Types.ObjectId.isValid(answer.selectedOption));
    if (!isValidAnswers) {
        return res.status(400).json({
            success: false,
            message: 'Invalid answer format. Each answer must have valid questionId and selectedOption'
        });
    }
    try {
        new Date(startTime);
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Invalid startTime format'
        });
    }
    next();
};
exports.validateQuizSubmission = validateQuizSubmission;

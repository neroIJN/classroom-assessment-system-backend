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
exports.errorMiddleware = exports.validateEssayAssignmentInput = exports.checkEssayAssignmentAvailability = exports.checkEssayAssignmentExists = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const essay_model_1 = __importDefault(require("../models/essay.model"));
const ErrorHandler_1 = require("../utils/ErrorHandler");
// Middleware to check if an essay assignment exists by ID
const checkEssayAssignmentExists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Validate the ID format
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return next(new ErrorHandler_1.ErrorHandler("Invalid essay assignment ID", 400));
        }
        // Find the essay assignment by ID
        const essayAssignment = yield essay_model_1.default.findById(id);
        if (!essayAssignment) {
            return next(new ErrorHandler_1.ErrorHandler("Essay assignment not found", 404));
        }
        // Attach the essay assignment to the request object for further use
        req.essayAssignment = essayAssignment;
        next();
    }
    catch (error) {
        next(new ErrorHandler_1.ErrorHandler(error.message || "Error checking essay assignment existence", 500));
    }
});
exports.checkEssayAssignmentExists = checkEssayAssignmentExists;
// Middleware to check if essay assignment is currently available
const checkEssayAssignmentAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const essayAssignment = req.essayAssignment;
        const currentDate = new Date();
        if (!essayAssignment) {
            return next(new ErrorHandler_1.ErrorHandler("Essay assignment not found", 404));
        }
        // Check if the current date is within the essay assignment's availability period
        if (currentDate < essayAssignment.startDate) {
            return next(new ErrorHandler_1.ErrorHandler("This essay assignment is not yet available", 403));
        }
        if (currentDate > essayAssignment.endDate) {
            return next(new ErrorHandler_1.ErrorHandler("This essay assignment has expired", 403));
        }
        next();
    }
    catch (error) {
        next(new ErrorHandler_1.ErrorHandler(error.message || "Error checking essay assignment availability", 500));
    }
});
exports.checkEssayAssignmentAvailability = checkEssayAssignmentAvailability;
// Middleware to validate essay assignment input
const validateEssayAssignmentInput = (req, res, next) => {
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
exports.validateEssayAssignmentInput = validateEssayAssignmentInput;
// Global error-handling middleware
const errorMiddleware = (err, req, res, next) => {
    const statusCode = err instanceof ErrorHandler_1.ErrorHandler ? err.statusCode : 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        message
    });
};
exports.errorMiddleware = errorMiddleware;

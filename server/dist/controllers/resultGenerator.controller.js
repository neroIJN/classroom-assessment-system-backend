"use strict";
// require("dotenv").config();
// import xlsx from 'xlsx';
// import { Request, Response, NextFunction } from "express";
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
exports.getStudentQuizResultsController = exports.getResultsController = exports.downloadFullExcelSheet = exports.downloadExcelSheet = void 0;
// import { ErrorHandler } from "../utils/ErrorHandler";
// import { CatchAsyncError } from "../middleware/catchAsyncError";
// import QuizSubmissionModel from '../models/QuizSubmissionModel';
// export const generateExcelSheet = CatchAsyncError(
//     async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             await QuizSubmissionModel.find({}).then(result => {
//                 if(result.length > 0){
//                     let response = JSON.parse(JSON.stringify(result));
//                     let workbook = xlsx.utils.book_new();
//                     let worksheet = xlsx.utils.json_to_sheet(response);
//                     xlsx.utils.book_append_sheet(workbook, worksheet, 'Users');
//                     xlsx.writeFile(workbook, 'resultSheet.xlsx');
//                     res.status(200).json({success: true, message: "Excel file generated successfully", response})
//                 }else{
//                     return next(new ErrorHandler("NO data to found to export", 400));
//                 }
//             })
//         } catch (error: any) {
//             return next(new ErrorHandler(error.message, 400));
//         }
//     }
// );
// import mongoose from "mongoose";
const xlsx_1 = __importDefault(require("xlsx"));
const mongoose_1 = __importDefault(require("mongoose"));
const ErrorHandler_1 = require("../utils/ErrorHandler");
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const QuizSubmissionModel_1 = __importDefault(require("../models/QuizSubmissionModel"));
const result_model_1 = __importDefault(require("../models/result.model"));
const result_service_1 = require("../services/result.service");
exports.downloadExcelSheet = (0, catchAsyncError_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assignmentId } = req.params;
        // Validate if assignmentId is a valid ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(assignmentId)) {
            return next(new ErrorHandler_1.ErrorHandler("Invalid assignmentId format", 400));
        }
        // Fetch data from QuizSubmissionModel
        const quizSubmissions = yield QuizSubmissionModel_1.default.find({ assignmentId }).exec();
        if (quizSubmissions.length > 0) {
            // Save data to ResultModel
            const results = yield result_model_1.default.insertMany(quizSubmissions.map(submission => ({
                assignmentId: submission.assignmentId,
                userId: submission.userId,
                registrationNumber: submission.registrationNumber,
                score: submission.score,
                timeTaken: submission.timeTaken,
                submittedAt: submission.submittedAt,
            })));
            // Convert only required fields to Excel
            const response = JSON.parse(JSON.stringify(results));
            const workbook = xlsx_1.default.utils.book_new();
            const worksheet = xlsx_1.default.utils.json_to_sheet(response);
            xlsx_1.default.utils.book_append_sheet(workbook, worksheet, "Results");
            // Create a buffer for the Excel file
            const excelBuffer = xlsx_1.default.write(workbook, {
                bookType: "xlsx",
                type: "buffer",
            });
            // Set headers for file download
            res.setHeader("Content-Disposition", "attachment; filename=resultSheet.xlsx");
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            // Send the Excel file as a response
            res.send(excelBuffer);
        }
        else {
            return next(new ErrorHandler_1.ErrorHandler("No data found to export", 400));
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.ErrorHandler(error.message, 400));
    }
}));
exports.downloadFullExcelSheet = (0, catchAsyncError_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assignmentId } = req.params;
        // Validate if assignmentId is a valid ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(assignmentId)) {
            return next(new ErrorHandler_1.ErrorHandler("Invalid assignmentId format", 400));
        }
        const results = yield QuizSubmissionModel_1.default.find({ assignmentId });
        if (results.length > 0) {
            const response = JSON.parse(JSON.stringify(results));
            const workbook = xlsx_1.default.utils.book_new();
            const worksheet = xlsx_1.default.utils.json_to_sheet(response);
            xlsx_1.default.utils.book_append_sheet(workbook, worksheet, "Users");
            // Create a buffer for the Excel file
            const excelBuffer = xlsx_1.default.write(workbook, {
                bookType: "xlsx",
                type: "buffer",
            });
            // Set headers for file download
            res.setHeader("Content-Disposition", "attachment; filename=resultSheet.xlsx");
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            // Send the Excel file as a response
            res.send(excelBuffer);
        }
        else {
            return next(new ErrorHandler_1.ErrorHandler("No data found to export", 400));
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.ErrorHandler(error.message, 400));
    }
}));
const getResultsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assignmentId } = req.params;
        // Validate if assignmentId is a valid ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(assignmentId)) {
            return next(new ErrorHandler_1.ErrorHandler("Invalid assignmentId format", 400));
        }
        if (!assignmentId) {
            return res.status(400).json({ success: false, message: "Assignment ID is required" });
        }
        const results = yield QuizSubmissionModel_1.default.find({ assignmentId });
        if (!results || results.length === 0) {
            return res.status(404).json({ success: false, message: "No results found for this assignment" });
        }
        res.status(200).json({
            success: true,
            results,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getResultsController = getResultsController;
const getStudentQuizResultsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assignmentId, userId } = req.params;
        const results = yield (0, result_service_1.getStudentQuizResults)(assignmentId, userId);
        if (!results) {
            return res.status(404).json({ success: false, message: 'No submission found for this student.' });
        }
        res.status(200).json({
            success: true,
            results,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getStudentQuizResultsController = getStudentQuizResultsController;

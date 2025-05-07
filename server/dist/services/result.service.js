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
exports.getStudentEssayViolations = exports.getAssignmentViolationStats = exports.getStudentQuizResults = exports.getResultsByAssignmentId = void 0;
const QuizSubmissionModel_1 = __importDefault(require("../models/QuizSubmissionModel"));
const result_model_1 = __importDefault(require("../models/result.model"));
const violation_model_1 = require("../models/violation.model");
const mongoose_1 = require("mongoose");
/**
 * Get results by assignment ID
 * @param assignmentId - Assignment ID
 * @returns A list of results
 */
const getResultsByAssignmentId = (assignmentId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield result_model_1.default.find({ assignmentId }).select("registrationNumber score timeTaken submittedAt").exec();
});
exports.getResultsByAssignmentId = getResultsByAssignmentId;
const getStudentQuizResults = (assignmentId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const submission = yield QuizSubmissionModel_1.default.findOne({
            assignmentId: assignmentId,
            userId: userId,
        }).select('answers score timeTaken submittedAt'); // Only selecting relevant fields
        if (!submission) {
            return null;
        }
        return {
            userId: submission.userId,
            assignmentId: submission.assignmentId,
            answers: submission.answers,
            score: submission.score,
            timeTaken: submission.timeTaken,
            submittedAt: submission.submittedAt,
        };
    }
    catch (error) {
        throw new Error('Error retrieving quiz results');
    }
});
exports.getStudentQuizResults = getStudentQuizResults;
const getAssignmentViolationStats = (assignmentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield violation_model_1.ViolationModel.aggregate([
            {
                $match: { quizId: new mongoose_1.Types.ObjectId(assignmentId) }
            },
            {
                $group: {
                    _id: null,
                    totalViolations: { $sum: 1 },
                    violationsByType: {
                        $push: "$type"
                    },
                    uniqueStudents: { $addToSet: "$studentId" }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalViolations: 1,
                    uniqueStudentsCount: { $size: "$uniqueStudents" },
                    violationsByType: {
                        $reduce: {
                            input: "$violationsByType",
                            initialValue: {},
                            in: {
                                $mergeObjects: [
                                    "$$value",
                                    { $literal: { ["$$this"]: 1 } }
                                ]
                            }
                        }
                    }
                }
            }
        ]);
        return stats[0] || {
            totalViolations: 0,
            uniqueStudentsCount: 0,
            violationsByType: {}
        };
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch violation statistics: ${error.message}`);
        }
        throw new Error('Failed to fetch violation statistics due to an unknown error');
    }
});
exports.getAssignmentViolationStats = getAssignmentViolationStats;
/**
 * Get essay violations for a specific student
 * @param assignmentId - Essay assignment ID
 * @param studentId - Student ID
 * @returns Array of violations for the student
 */
const getStudentEssayViolations = (assignmentId, studentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Convert string IDs to ObjectIds
        const quizId = new mongoose_1.Types.ObjectId(assignmentId);
        const studentObjectId = new mongoose_1.Types.ObjectId(studentId);
        // Find violations for this student on this assignment
        const violations = yield violation_model_1.ViolationModel.find({
            quizId: quizId,
            studentId: studentObjectId
        }).sort({ "violation.timestamp": -1 }); // Most recent first
        return violations;
    }
    catch (error) {
        console.error('Error fetching student essay violations:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to fetch student violations: ${error.message}`);
        }
        throw new Error('Failed to fetch student violations due to an unknown error');
    }
});
exports.getStudentEssayViolations = getStudentEssayViolations;

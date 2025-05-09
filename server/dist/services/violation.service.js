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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViolationService = void 0;
// src/services/violation.service.ts
const violation_model_1 = require("../models/violation.model");
const mongoose_1 = require("mongoose");
class ViolationService {
    createViolation(violationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const violation = new violation_model_1.ViolationModel({
                    studentId: new mongoose_1.Types.ObjectId(violationDto.studentId),
                    quizId: new mongoose_1.Types.ObjectId(violationDto.quizId),
                    violation: Object.assign(Object.assign({}, violationDto.violation), { timestamp: new Date(violationDto.violation.timestamp) })
                });
                return yield violation.save();
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Failed to create violation: ${error.message}`);
                }
                throw error;
            }
        });
    }
    getViolationsByQuiz(quizId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield violation_model_1.ViolationModel.find({ quizId: new mongoose_1.Types.ObjectId(quizId) });
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Failed to fetch violations: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
                throw error;
            }
        });
    }
    getViolationsByQuizAndStudent(quizId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield violation_model_1.ViolationModel.find({
                    quizId: new mongoose_1.Types.ObjectId(quizId),
                    studentId: new mongoose_1.Types.ObjectId(studentId)
                }).sort({ 'violation.timestamp': 1 });
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Failed to fetch violations: ${error.message}`);
                }
                throw error;
            }
        });
    }
    getQuizViolationsSummary(quizId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Aggregate violations by student
                const summary = yield violation_model_1.ViolationModel.aggregate([
                    {
                        $match: {
                            quizId: new mongoose_1.Types.ObjectId(quizId)
                        }
                    },
                    {
                        $group: {
                            _id: '$studentId',
                            totalViolations: { $sum: 1 },
                            violationTypes: {
                                $push: '$violation.type'
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: 'users', // Assuming your user collection name
                            localField: '_id',
                            foreignField: '_id',
                            as: 'student'
                        }
                    },
                    {
                        $unwind: '$student'
                    },
                    {
                        $project: {
                            studentName: '$student.name',
                            totalViolations: 1,
                            violationTypes: 1
                        }
                    }
                ]);
                return summary;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Failed to fetch violations summary: ${error.message}`);
                }
                throw error;
            }
        });
    }
    getLiveViolations(quizId_1) {
        return __awaiter(this, arguments, void 0, function* (quizId, timeWindow = 30) {
            try {
                // Get violations from the last 'timeWindow' minutes (default 30 minutes)
                const cutoffTime = new Date(Date.now() - timeWindow * 60 * 1000);
                return yield violation_model_1.ViolationModel.find({
                    quizId,
                    'violation.timestamp': { $gte: cutoffTime }
                })
                    .populate('studentId', 'name email registrationNumber')
                    .sort({ 'violation.timestamp': -1 });
            }
            catch (error) {
                throw new Error(`Failed to fetch live violations: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });
    }
}
exports.ViolationService = ViolationService;

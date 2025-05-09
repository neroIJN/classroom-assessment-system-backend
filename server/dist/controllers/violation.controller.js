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
exports.ViolationController = void 0;
const violation_service_1 = require("../services/violation.service");
class ViolationController {
    constructor() {
        this.logViolation = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const violationDto = req.body;
                const violation = yield this.violationService.createViolation(violationDto);
                res.status(201).json({
                    success: true,
                    message: 'Violation logged successfully',
                    violation
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to log violation',
                    error: (error instanceof Error) ? error.message : 'Unknown error'
                });
            }
        });
        this.getViolationsByQuizAndStudent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { quizId, studentId } = req.params;
                const violations = yield this.violationService.getViolationsByQuizAndStudent(quizId, studentId);
                res.status(200).json({
                    success: true,
                    violations
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to fetch violations',
                    error: (error instanceof Error) ? error.message : 'Unknown error'
                });
            }
        });
        // Add this method to get summary for all students in a quiz
        this.getQuizViolationsSummary = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { quizId } = req.params;
                const summary = yield this.violationService.getQuizViolationsSummary(quizId);
                res.status(200).json({
                    success: true,
                    summary
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to fetch violations summary',
                    error: (error instanceof Error) ? error.message : 'Unknown error'
                });
            }
        });
        this.getLiveViolations = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { quizId } = req.params;
                const timeWindow = parseInt(req.query.timeWindow) || 30; // Default to 30 minutes
                const violations = yield this.violationService.getLiveViolations(quizId, timeWindow);
                res.status(200).json({
                    success: true,
                    violations
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to fetch live violations',
                    error: (error instanceof Error) ? error.message : 'Unknown error'
                });
            }
        });
        this.violationService = new violation_service_1.ViolationService();
    }
}
exports.ViolationController = ViolationController;

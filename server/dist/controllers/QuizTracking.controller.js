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
exports.getQuizStatsController = exports.completeQuizSessionController = exports.heartbeatController = exports.startQuizSessionController = void 0;
const QuizTrackng_service_1 = require("../services/QuizTrackng.service");
const startQuizSessionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quizId, studentId } = req.body;
        if (!quizId || !studentId) {
            return res.status(400).json({
                success: false,
                message: 'Quiz ID and Student ID are required'
            });
        }
        const session = yield (0, QuizTrackng_service_1.startQuizSession)(quizId, studentId);
        res.status(200).json({
            success: true,
            session
        });
    }
    catch (error) {
        console.error('Error starting quiz session:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to start quiz session'
        });
    }
});
exports.startQuizSessionController = startQuizSessionController;
const heartbeatController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quizId, studentId } = req.body;
        if (!quizId || !studentId) {
            return res.status(400).json({
                success: false,
                message: 'Quiz ID and Student ID are required'
            });
        }
        yield (0, QuizTrackng_service_1.markSessionAsActive)(quizId, studentId);
        res.status(200).json({
            success: true,
            message: 'Session activity updated'
        });
    }
    catch (error) {
        console.error('Error updating session activity:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update session activity'
        });
    }
});
exports.heartbeatController = heartbeatController;
const completeQuizSessionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quizId, studentId } = req.body;
        if (!quizId || !studentId) {
            return res.status(400).json({
                success: false,
                message: 'Quiz ID and Student ID are required'
            });
        }
        yield (0, QuizTrackng_service_1.completeQuizSession)(quizId, studentId);
        res.status(200).json({
            success: true,
            message: 'Quiz session completed'
        });
    }
    catch (error) {
        console.error('Error completing quiz session:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to complete quiz session'
        });
    }
});
exports.completeQuizSessionController = completeQuizSessionController;
const getQuizStatsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quizId } = req.params;
        //console.log("Stats request received for quizId:", quizId);
        if (!quizId) {
            console.log("No quizId provided");
            return res.status(400).json({
                success: false,
                message: 'Quiz ID is required'
            });
        }
        const stats = yield (0, QuizTrackng_service_1.getQuizSessionStats)(quizId);
        //console.log("Stats retrieved:", stats);
        res.status(200).json({
            success: true,
            activeCount: stats.activeCount,
            completedCount: stats.completedCount
        });
    }
    catch (error) {
        console.error('Error fetching quiz stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch quiz stats'
        });
    }
});
exports.getQuizStatsController = getQuizStatsController;

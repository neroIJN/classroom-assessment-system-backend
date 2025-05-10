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
exports.cleanupInactiveSessions = exports.getQuizSessionStats = exports.completeQuizSession = exports.markSessionAsActive = exports.startQuizSession = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ActiveQuizSession_model_1 = __importDefault(require("./../models/ActiveQuizSession.model"));
const startQuizSession = (quizId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if there's already an active session for this user and quiz
        const existingSession = yield ActiveQuizSession_model_1.default.findOne({
            quizId: new mongoose_1.default.Types.ObjectId(quizId),
            userId: new mongoose_1.default.Types.ObjectId(userId),
            completed: false
        });
        if (existingSession) {
            // Update the existing session's lastActivity timestamp
            existingSession.lastActivity = new Date();
            yield existingSession.save();
            return existingSession;
        }
        // Create a new session
        const newSession = new ActiveQuizSession_model_1.default({
            quizId: new mongoose_1.default.Types.ObjectId(quizId),
            userId: new mongoose_1.default.Types.ObjectId(userId),
            startTime: new Date(),
            lastActivity: new Date()
        });
        yield newSession.save();
        return newSession;
    }
    catch (error) {
        console.error('Error starting quiz session:', error);
        throw error;
    }
});
exports.startQuizSession = startQuizSession;
const markSessionAsActive = (quizId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield ActiveQuizSession_model_1.default.updateOne({
            quizId: new mongoose_1.default.Types.ObjectId(quizId),
            userId: new mongoose_1.default.Types.ObjectId(userId),
            completed: false
        }, { $set: { lastActivity: new Date() } });
    }
    catch (error) {
        console.error('Error updating session activity:', error);
        throw error;
    }
});
exports.markSessionAsActive = markSessionAsActive;
const completeQuizSession = (quizId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield ActiveQuizSession_model_1.default.updateOne({
            quizId: new mongoose_1.default.Types.ObjectId(quizId),
            userId: new mongoose_1.default.Types.ObjectId(userId),
            completed: false
        }, {
            $set: {
                completed: true,
                endTime: new Date()
            }
        });
    }
    catch (error) {
        console.error('Error completing quiz session:', error);
        throw error;
    }
});
exports.completeQuizSession = completeQuizSession;
const getQuizSessionStats = (quizId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find all sessions that have had activity in the last 5 minutes and aren't completed
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const activeCount = yield ActiveQuizSession_model_1.default.countDocuments({
            quizId: new mongoose_1.default.Types.ObjectId(quizId),
            completed: false,
            lastActivity: { $gte: fiveMinutesAgo }
        });
        const completedCount = yield ActiveQuizSession_model_1.default.countDocuments({
            quizId: new mongoose_1.default.Types.ObjectId(quizId),
            completed: true
        });
        return { activeCount, completedCount };
    }
    catch (error) {
        console.error('Error getting quiz session stats:', error);
        throw error;
    }
});
exports.getQuizSessionStats = getQuizSessionStats;
// Function to clean up inactive sessions (can be run via a scheduled job)
const cleanupInactiveSessions = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        // Mark sessions as completed if they've been inactive for 30+ minutes
        yield ActiveQuizSession_model_1.default.updateMany({
            completed: false,
            lastActivity: { $lt: thirtyMinutesAgo }
        }, {
            $set: {
                completed: true,
                endTime: new Date()
            }
        });
    }
    catch (error) {
        console.error('Error cleaning up inactive sessions:', error);
        throw error;
    }
});
exports.cleanupInactiveSessions = cleanupInactiveSessions;

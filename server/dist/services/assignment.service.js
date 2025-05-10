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
exports.getQuizSubmissionsByAssignment = exports.getQuizSubmissionsByUser = exports.getQuizSubmission = exports.submitQuiz = exports.updateScore = exports.startQuiz = exports.getPastAssignments = exports.getUpcomingAssignments = exports.getActiveAssignments = exports.getAllAssignments = exports.deleteAssignment = exports.updateAssignment = exports.getAssignmentById = exports.createAssignment = void 0;
const mcq_model_1 = __importDefault(require("../models/mcq.model"));
const QuizSubmissionModel_1 = __importDefault(require("../models/QuizSubmissionModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user.model"));
const ErrorHandler_1 = require("../utils/ErrorHandler");
const createAssignment = (assignmentData) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate date logic
    const startDate = new Date(assignmentData.startDate);
    const endDate = new Date(assignmentData.endDate);
    if (startDate >= endDate) {
        throw new ErrorHandler_1.ErrorHandler('End date must be after start date', 400);
    }
    const assignment = new mcq_model_1.default(assignmentData);
    return yield assignment.save();
});
exports.createAssignment = createAssignment;
const getAssignmentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield mcq_model_1.default.findById(id);
});
exports.getAssignmentById = getAssignmentById;
const updateAssignment = (id, assignmentData) => __awaiter(void 0, void 0, void 0, function* () {
    // If updating dates, validate them
    if (assignmentData.startDate || assignmentData.endDate) {
        const assignment = yield mcq_model_1.default.findById(id);
        if (!assignment) {
            throw new ErrorHandler_1.ErrorHandler('Assignment not found', 404);
        }
        const startDate = new Date(assignmentData.startDate || assignment.startDate);
        const endDate = new Date(assignmentData.endDate || assignment.endDate);
        if (startDate >= endDate) {
            throw new ErrorHandler_1.ErrorHandler('End date must be after start date', 400);
        }
    }
    return yield mcq_model_1.default.findByIdAndUpdate(id, { $set: assignmentData }, { new: true, runValidators: true });
});
exports.updateAssignment = updateAssignment;
const deleteAssignment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield mcq_model_1.default.findByIdAndDelete(id);
});
exports.deleteAssignment = deleteAssignment;
const getAllAssignments = (teacherId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield mcq_model_1.default.find({ teacherId });
});
exports.getAllAssignments = getAllAssignments;
const getActiveAssignments = (teacherId) => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date();
    return yield mcq_model_1.default.find({
        teacherId,
        startDate: { $lte: currentDate },
        endDate: { $gte: currentDate }
    });
});
exports.getActiveAssignments = getActiveAssignments;
const getUpcomingAssignments = (teacherId) => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date();
    return yield mcq_model_1.default.find({
        teacherId,
        startDate: { $gt: currentDate }
    });
});
exports.getUpcomingAssignments = getUpcomingAssignments;
const getPastAssignments = (teacherId) => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date();
    return yield mcq_model_1.default.find({
        teacherId,
        endDate: { $lt: currentDate }
    });
});
exports.getPastAssignments = getPastAssignments;
const startQuiz = (assignmentId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const assignment = yield mcq_model_1.default.findById(assignmentId);
    if (!assignment) {
        throw new ErrorHandler_1.ErrorHandler('Assignment not found', 404);
    }
    // Check if the assignment is currently available
    const currentDate = new Date();
    if (currentDate < assignment.startDate) {
        throw new ErrorHandler_1.ErrorHandler('This assignment is not yet available', 403);
    }
    if (currentDate > assignment.endDate) {
        throw new ErrorHandler_1.ErrorHandler('This assignment has expired', 403);
    }
    const startTime = new Date();
    const score = 0;
    return { assignment, startTime, score };
});
exports.startQuiz = startQuiz;
// Update score in real time
const updateScore = (assignment, answers) => {
    let score = 0;
    answers.forEach(answer => {
        const question = assignment.questions.find(q => q._id && q._id.toString() === answer.questionId);
        if (question) {
            const correctOption = question.options.find(option => option.isCorrect);
            if (correctOption && correctOption._id && correctOption._id.toString() === answer.selectedOption) {
                score = score + question.pointsForQuestion; // Add points for the correct answer
            }
        }
    });
    return score;
};
exports.updateScore = updateScore;
const submitQuiz = (submission) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch the complete assignment
    const assignment = yield mcq_model_1.default.findById(submission.assignmentId);
    if (!assignment) {
        throw new ErrorHandler_1.ErrorHandler('Assignment not found', 404);
    }
    // Check if the assignment is still available for submission
    const currentDate = new Date();
    if (currentDate > assignment.endDate) {
        throw new ErrorHandler_1.ErrorHandler('This assignment has expired, submissions are no longer accepted', 403);
    }
    console.log('Assignment structure:', JSON.stringify(assignment, null, 2));
    const user = yield user_model_1.default.findById(submission.userId);
    if (!user) {
        throw new ErrorHandler_1.ErrorHandler('User not found', 404);
    }
    const registrationNumber = user.registrationNumber;
    const endTime = new Date();
    const timeTaken = (endTime.getTime() - submission.startTime.getTime()) / 60000;
    // Check if time limit is exceeded
    if (timeTaken > assignment.timeLimit) {
        throw new ErrorHandler_1.ErrorHandler('Time limit exceeded', 400);
    }
    let score = 0;
    const enrichedAnswers = submission.answers.map(answer => {
        // Find the question
        const question = assignment.questions.find(q => q._id.toString() === answer.questionId);
        console.log('Question found:', JSON.stringify(question, null, 2));
        if (!question) {
            throw new ErrorHandler_1.ErrorHandler(`Question ${answer.questionId} not found`, 400);
        }
        // Try different possible locations of the question text
        const questionText = question.questionText;
        if (!questionText) {
            console.log('Question object structure:', question);
            throw new ErrorHandler_1.ErrorHandler(`Question text not found in structure for question ${answer.questionId}`, 400);
        }
        const selectedOption = question.options.find(opt => opt._id.toString() === answer.selectedOption);
        if (!selectedOption) {
            throw new ErrorHandler_1.ErrorHandler(`Option ${answer.selectedOption} not found for question ${answer.questionId}`, 400);
        }
        // Try different possible locations of the option text
        const optionText = selectedOption.text;
        if (!optionText) {
            console.log('Option object structure:', selectedOption);
            throw new ErrorHandler_1.ErrorHandler(`Option text not found in structure for option ${answer.selectedOption}`, 400);
        }
        if (selectedOption.isCorrect) {
            score = score + question.pointsForQuestion; // Add points for the correct answer
        }
        return {
            questionId: new mongoose_1.default.Types.ObjectId(answer.questionId),
            questionText: questionText,
            selectedOption: new mongoose_1.default.Types.ObjectId(answer.selectedOption),
            selectedOptionText: optionText
        };
    });
    const quizSubmission = new QuizSubmissionModel_1.default({
        assignmentId: new mongoose_1.default.Types.ObjectId(submission.assignmentId),
        userId: new mongoose_1.default.Types.ObjectId(submission.userId),
        registrationNumber,
        answers: enrichedAnswers,
        score,
        timeTaken,
        submittedAt: endTime
    });
    yield quizSubmission.save();
    return quizSubmission;
});
exports.submitQuiz = submitQuiz;
const getQuizSubmission = (submissionId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield QuizSubmissionModel_1.default.findById(submissionId);
});
exports.getQuizSubmission = getQuizSubmission;
const getQuizSubmissionsByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield QuizSubmissionModel_1.default.find({ userId });
});
exports.getQuizSubmissionsByUser = getQuizSubmissionsByUser;
const getQuizSubmissionsByAssignment = (assignmentId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield QuizSubmissionModel_1.default.find({ assignmentId });
});
exports.getQuizSubmissionsByAssignment = getQuizSubmissionsByAssignment;

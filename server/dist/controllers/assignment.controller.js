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
exports.calculateScoreController = exports.getQuizSubmissionsByAssignmentController = exports.getQuizSubmissionsByUserController = exports.getQuizSubmissionController = exports.submitQuizController = exports.startQuizController = exports.getPastAssignmentsController = exports.getUpcomingAssignmentsController = exports.getActiveAssignmentsController = exports.getAllAssignmentsController = exports.deleteAssignmentController = exports.updateAssignmentController = exports.getAssignmentByIdController = exports.createAssignmentController = void 0;
const assignment_service_1 = require("../services/assignment.service");
// Create a new assignment
const createAssignmentController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assignment = yield (0, assignment_service_1.createAssignment)(req.body);
        console.log(assignment);
        res.status(201).json({
            success: true,
            assignment,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createAssignmentController = createAssignmentController;
// Get an assignment by ID
const getAssignmentByIdController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assignment = yield (0, assignment_service_1.getAssignmentById)(req.params.id);
        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found',
            });
        }
        // For students accessing the waiting page, don't include questions to prevent cheating
        // Only return the basic information needed for the waiting page
        if (req.query.forWaiting === 'true') {
            return res.status(200).json({
                _id: assignment._id,
                title: assignment.title,
                description: assignment.description,
                timeLimit: assignment.timeLimit,
                startDate: assignment.startDate,
                endDate: assignment.endDate,
                teacherId: assignment.teacherId,
                success: true
            });
        }
        // Otherwise return the full assignment (for teachers or when taking the quiz)
        res.status(200).json({
            success: true,
            assignment,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAssignmentByIdController = getAssignmentByIdController;
// Update an assignment by ID
const updateAssignmentController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedAssignment = yield (0, assignment_service_1.updateAssignment)(req.params.id, req.body);
        res.status(200).json({
            success: true,
            assignment: updatedAssignment,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateAssignmentController = updateAssignmentController;
// Delete an assignment by ID
const deleteAssignmentController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, assignment_service_1.deleteAssignment)(req.params.id);
        res.status(204).json({
            success: true,
            message: 'Assignment deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteAssignmentController = deleteAssignmentController;
// Get all assignments for a teacher
const getAllAssignmentsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assignments = yield (0, assignment_service_1.getAllAssignments)(req.params.teacherId);
        res.status(200).json({
            success: true,
            assignments,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllAssignmentsController = getAllAssignmentsController;
// Get active assignments for a teacher
const getActiveAssignmentsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assignments = yield (0, assignment_service_1.getActiveAssignments)(req.params.teacherId);
        res.status(200).json({
            success: true,
            assignments,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getActiveAssignmentsController = getActiveAssignmentsController;
// Get upcoming assignments for a teacher
const getUpcomingAssignmentsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assignments = yield (0, assignment_service_1.getUpcomingAssignments)(req.params.teacherId);
        res.status(200).json({
            success: true,
            assignments,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUpcomingAssignmentsController = getUpcomingAssignmentsController;
// Get past assignments for a teacher
const getPastAssignmentsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assignments = yield (0, assignment_service_1.getPastAssignments)(req.params.teacherId);
        res.status(200).json({
            success: true,
            assignments,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getPastAssignmentsController = getPastAssignmentsController;
// Start a quiz
const startQuizController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assignment, startTime, score } = yield (0, assignment_service_1.startQuiz)(req.params.id, req.body.userId);
        res.status(200).json({
            success: true,
            assignment,
            startTime,
            score,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.startQuizController = startQuizController;
// Submit a quiz
const submitQuizController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, answers, startTime } = req.body;
        if (!Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                message: 'Answers must be provided as an array',
            });
        }
        const submission = {
            assignmentId: req.params.id,
            userId,
            answers,
            startTime: new Date(startTime),
        };
        const result = yield (0, assignment_service_1.submitQuiz)(submission);
        res.status(200).json({
            success: true,
            submission: result,
        });
    }
    catch (error) {
        console.error('Error in quiz submission:', error);
        if (error.message === 'Time limit exceeded' ||
            error.message === 'This assignment has expired, submissions are no longer accepted' ||
            error.message.includes('Question') ||
            error.message.includes('Option')) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
        else {
            next(error);
        }
    }
});
exports.submitQuizController = submitQuizController;
// Get a specific quiz submission
const getQuizSubmissionController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const submission = yield (0, assignment_service_1.getQuizSubmission)(req.params.submissionId);
        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found',
            });
        }
        res.status(200).json({
            success: true,
            submission,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getQuizSubmissionController = getQuizSubmissionController;
// Get all quiz submissions for a user
const getQuizSubmissionsByUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const submissions = yield (0, assignment_service_1.getQuizSubmissionsByUser)(req.params.userId);
        res.status(200).json({
            success: true,
            submissions,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getQuizSubmissionsByUserController = getQuizSubmissionsByUserController;
// Get all quiz submissions for an assignment
const getQuizSubmissionsByAssignmentController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const submissions = yield (0, assignment_service_1.getQuizSubmissionsByAssignment)(req.params.id);
        res.status(200).json({
            success: true,
            submissions,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getQuizSubmissionsByAssignmentController = getQuizSubmissionsByAssignmentController;
// Calculate the score real time for quiz
const calculateScoreController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assignment = yield (0, assignment_service_1.getAssignmentById)(req.params.id);
        const { answers } = req.body;
        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found',
            });
        }
        const score = (0, assignment_service_1.updateScore)(assignment, answers);
        res.status(200).json({
            success: true,
            score
        });
    }
    catch (error) {
        next(error);
    }
});
exports.calculateScoreController = calculateScoreController;

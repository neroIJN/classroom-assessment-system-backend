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
exports.getStudentEssayResultController = exports.getStudentEssayViolationsController = exports.getEssayViolationSummaryController = exports.getEssayResultsController = exports.getEssaySubmissionsByAssignmentController = exports.getEssaySubmissionsByUserController = exports.getEssaySubmissionController = exports.submitEssayAssignmentController = exports.startEssayAssignmentController = exports.addEssayItemController = exports.getPastEssayAssignmentsController = exports.getUpcomingEssayAssignmentsController = exports.getActiveEssayAssignmentsController = exports.getAllEssayAssignmentsController = exports.deleteEssayAssignmentController = exports.updateEssayAssignmentController = exports.getEssayAssignmentByIdController = exports.createEssayAssignmentController = void 0;
const essay_service_1 = require("../services/essay.service");
const ErrorHandler_1 = require("../utils/ErrorHandler");
const result_service_1 = require("../services/result.service");
const user_model_1 = __importDefault(require("../models/user.model"));
// Create a new essay assignment
const createEssayAssignmentController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const essayAssignment = yield (0, essay_service_1.createEssayAssignment)(req.body);
        res.status(201).json({
            success: true,
            essayAssignment,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createEssayAssignmentController = createEssayAssignmentController;
// Get an essay assignment by ID
const getEssayAssignmentByIdController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const essayAssignment = yield (0, essay_service_1.getEssayById)(req.params.id);
        if (!essayAssignment) {
            return res.status(404).json({
                success: false,
                message: "Essay assignment not found",
            });
        }
        res.status(200).json({
            success: true,
            essayAssignment,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getEssayAssignmentByIdController = getEssayAssignmentByIdController;
// Update an essay assignment by ID
const updateEssayAssignmentController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedEssayAssignment = yield (0, essay_service_1.updateEssay)(req.params.id, req.body);
        res.status(200).json({
            success: true,
            essayAssignment: updatedEssayAssignment,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateEssayAssignmentController = updateEssayAssignmentController;
// Delete an essay assignment by ID
const deleteEssayAssignmentController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, essay_service_1.deleteEssay)(req.params.id);
        res.status(204).json({
            success: true,
            message: "Essay assignment deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteEssayAssignmentController = deleteEssayAssignmentController;
// Get all essay assignments
const getAllEssayAssignmentsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const essayAssignments = yield (0, essay_service_1.getAllEssays)(req.params.teacherId);
        res.status(200).json({
            success: true,
            essayAssignments,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllEssayAssignmentsController = getAllEssayAssignmentsController;
// Get active essay assignments
const getActiveEssayAssignmentsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const essayAssignments = yield (0, essay_service_1.getActiveEssays)(req.params.teacherId);
        res.status(200).json({
            success: true,
            essayAssignments,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getActiveEssayAssignmentsController = getActiveEssayAssignmentsController;
// Get upcoming essay assignments
const getUpcomingEssayAssignmentsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const essayAssignments = yield (0, essay_service_1.getUpcomingEssays)(req.params.teacherId);
        res.status(200).json({
            success: true,
            essayAssignments,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUpcomingEssayAssignmentsController = getUpcomingEssayAssignmentsController;
// Get past essay assignments
const getPastEssayAssignmentsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const essayAssignments = yield (0, essay_service_1.getPastEssays)(req.params.teacherId);
        res.status(200).json({
            success: true,
            essayAssignments,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getPastEssayAssignmentsController = getPastEssayAssignmentsController;
// Add an item to an essay assignment
const addEssayItemController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedEssayAssignment = yield (0, essay_service_1.addEssayItem)(req.params.id, req.body);
        res.status(200).json({
            success: true,
            essayAssignment: updatedEssayAssignment,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.addEssayItemController = addEssayItemController;
// Start an essay assignment
const startEssayAssignmentController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assignment, startTime, score } = yield (0, essay_service_1.startEssayAssignment)(req.params.id, req.body.userId);
        res.status(200).json({
            success: true,
            assignment,
            startTime,
            score
        });
    }
    catch (error) {
        next(error);
    }
});
exports.startEssayAssignmentController = startEssayAssignmentController;
// Submit an essay assignment
const submitEssayAssignmentController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract data from request body
        const { userId, answers, startTime, assignmentId, essayId, registrationNumber } = req.body;
        // Determine assignment ID from either route params or request body
        const finalAssignmentId = req.params.id || assignmentId || essayId;
        if (!finalAssignmentId) {
            return res.status(400).json({
                success: false,
                message: "Assignment ID is required",
            });
        }
        if (!Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                message: "Answers must be an array",
            });
        }
        const submission = {
            assignmentId: finalAssignmentId,
            userId,
            registrationNumber: registrationNumber || "",
            answers,
            startTime: new Date(startTime),
        };
        const result = yield (0, essay_service_1.submitEssay)(submission);
        res.status(200).json({
            success: true,
            submission: result,
        });
    }
    catch (error) {
        console.error("Error in essay submission:", error);
        if (error.message === "Time limit exceeded" ||
            error.message === "This assignment has expired, submissions are no longer accepted" ||
            error.message === "This assignment is not yet available") {
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
exports.submitEssayAssignmentController = submitEssayAssignmentController;
// Get specific essay submission
const getEssaySubmissionController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const submission = yield (0, essay_service_1.getEssaySubmission)(req.params.submissionId);
        if (!submission) {
            return res.status(404).json({
                success: false,
                message: "Submission not found",
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
exports.getEssaySubmissionController = getEssaySubmissionController;
// Get all essay submissions for a user
const getEssaySubmissionsByUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const submissions = yield (0, essay_service_1.getEssaySubmissionsByUser)(req.params.userId);
        res.status(200).json({
            success: true,
            submissions,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getEssaySubmissionsByUserController = getEssaySubmissionsByUserController;
// Get all essay submissions for an assignment
const getEssaySubmissionsByAssignmentController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const submissions = yield (0, essay_service_1.getEssaySubmissionsByAssignment)(req.params.assignmentId);
        res.status(200).json({
            success: true,
            submissions,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getEssaySubmissionsByAssignmentController = getEssaySubmissionsByAssignmentController;
const getEssayResultsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Use assignmentId if that's what your router is using
        const assignmentId = req.params.assignmentId || req.params.id;
        // Log the request for debugging
        console.log(`Fetching essay results for assignment ID: ${assignmentId}`);
        // Fetch essay results
        const resultsData = yield (0, essay_service_1.getEssayResultsService)(assignmentId);
        res.status(200).json(resultsData);
    }
    catch (error) {
        console.error('Error fetching essay results:', error);
        next(new ErrorHandler_1.ErrorHandler(error instanceof Error ? error.message : 'Failed to fetch essay results', 500));
    }
});
exports.getEssayResultsController = getEssayResultsController;
/**
* Controller to get violation summary for a specific assignment
*/
const getEssayViolationSummaryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Fetch violation summary
        const violationData = yield (0, essay_service_1.getEssayViolationSummaryService)(id);
        res.status(200).json(violationData);
    }
    catch (error) {
        next(new ErrorHandler_1.ErrorHandler(error instanceof Error ? error.message : 'Failed to fetch violation summary', 500));
    }
});
exports.getEssayViolationSummaryController = getEssayViolationSummaryController;
const getStudentEssayViolationsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, sid } = req.params;
        // Fetch violations for the specific student
        const violations = yield (0, result_service_1.getStudentEssayViolations)(id, sid);
        res.status(200).json({
            success: true,
            violations
        });
    }
    catch (error) {
        next(new ErrorHandler_1.ErrorHandler(error instanceof Error ? error.message : 'Failed to fetch student essay violations', 500));
    }
});
exports.getStudentEssayViolationsController = getStudentEssayViolationsController;
const getStudentEssayResultController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, sid } = req.params;
        // Log the request for debugging
        console.log(`Fetching essay results for student ${sid} on assignment ${id}`);
        // Find the student submission using both IDs
        const submission = yield (0, essay_service_1.getStudentEssaySubmission)(id, sid);
        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'No submission found for this student'
            });
        }
        // Get student info
        const student = yield user_model_1.default.findById(sid);
        // Return the result
        res.status(200).json({
            success: true,
            results: submission,
            studentInfo: student ? {
                name: student.name,
                email: student.email,
                registrationNumber: student.registrationNumber
            } : null
        });
    }
    catch (error) {
        console.error('Error fetching student essay result:', error);
        next(new ErrorHandler_1.ErrorHandler(error instanceof Error ? error.message : 'Failed to fetch student essay result', 500));
    }
});
exports.getStudentEssayResultController = getStudentEssayResultController;

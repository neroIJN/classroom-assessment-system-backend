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
exports.getStudentEssaySubmission = exports.getEssayViolationSummaryService = exports.getEssayResultsService = exports.getEssaySubmissionsByAssignment = exports.getEssaySubmissionsByUser = exports.getEssaySubmission = exports.submitEssay = exports.startEssayAssignment = exports.addEssayItem = exports.getPastEssays = exports.getUpcomingEssays = exports.getActiveEssays = exports.getAllEssays = exports.deleteEssay = exports.updateEssay = exports.getEssayById = exports.createEssayAssignment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const essay_model_1 = __importDefault(require("../models/essay.model"));
const essaySubmissionModel_1 = __importDefault(require("../models/essaySubmissionModel"));
const user_model_1 = __importDefault(require("../models/user.model"));
const axios_1 = __importDefault(require("axios"));
const ErrorHandler_1 = require("../utils/ErrorHandler");
/**
 * Create a new essay assignment
 * @param essayAssignmentData - Data for the new essay assignment
 * @returns The created essay assignment
 */
const createEssayAssignment = (essayAssignmentData) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate date logic
    const startDate = new Date(essayAssignmentData.startDate);
    const endDate = new Date(essayAssignmentData.endDate);
    if (startDate >= endDate) {
        throw new ErrorHandler_1.ErrorHandler('End date must be after start date', 400);
    }
    const essayAssignment = new essay_model_1.default(essayAssignmentData);
    return yield essayAssignment.save();
});
exports.createEssayAssignment = createEssayAssignment;
/**
 * Get an essay by its Id
 * @param id - Essay ID
 * @returns The essay, or null if not found
 */
const getEssayById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield essay_model_1.default.findById(id).exec();
});
exports.getEssayById = getEssayById;
/**
 * Update an essay by its ID
 * @param id - Essay ID
 * @param updateData - Data to update
 * @returns The updated essay, or null if not found
 */
const updateEssay = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    // If updating dates, validate them
    if (updateData.startDate || updateData.endDate) {
        const essay = yield essay_model_1.default.findById(id);
        if (!essay) {
            throw new ErrorHandler_1.ErrorHandler('Essay assignment not found', 404);
        }
        const startDate = new Date(updateData.startDate || essay.startDate);
        const endDate = new Date(updateData.endDate || essay.endDate);
        if (startDate >= endDate) {
            throw new ErrorHandler_1.ErrorHandler('End date must be after start date', 400);
        }
    }
    return yield essay_model_1.default.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    }).exec();
});
exports.updateEssay = updateEssay;
/**
 * Delete an essay by its ID
 * @param id - Essay ID
 */
const deleteEssay = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield essay_model_1.default.findByIdAndDelete(id).exec();
});
exports.deleteEssay = deleteEssay;
/**
 * Get all essays optionally filtered by teacher Id
 * @param teacherId - (Optional) Teacher ID to filter essays
 * @returns A list of essays
 */
const getAllEssays = (teacherId) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = teacherId ? { teacherId } : {};
    return yield essay_model_1.default.find(filter).exec();
});
exports.getAllEssays = getAllEssays;
/**
 * Get active essay assignments for a teacher
 * @param teacherId - Teacher ID
 * @returns A list of active essay assignments
 */
const getActiveEssays = (teacherId) => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date();
    return yield essay_model_1.default.find({
        teacherId,
        startDate: { $lte: currentDate },
        endDate: { $gte: currentDate }
    }).exec();
});
exports.getActiveEssays = getActiveEssays;
/**
 * Get upcoming essay assignments for a teacher
 * @param teacherId - Teacher ID
 * @returns A list of upcoming essay assignments
 */
const getUpcomingEssays = (teacherId) => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date();
    return yield essay_model_1.default.find({
        teacherId,
        startDate: { $gt: currentDate }
    }).exec();
});
exports.getUpcomingEssays = getUpcomingEssays;
/**
 * Get past essay assignments for a teacher
 * @param teacherId - Teacher ID
 * @returns A list of past essay assignments
 */
const getPastEssays = (teacherId) => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date();
    return yield essay_model_1.default.find({
        teacherId,
        endDate: { $lt: currentDate }
    }).exec();
});
exports.getPastEssays = getPastEssays;
/**
 * Add an item to an essay assignment
 * @param essayId - Essay ID
 * @param itemData - Data for the new essay item
 * @returns The updated essay
 */
const addEssayItem = (essayId, itemData) => __awaiter(void 0, void 0, void 0, function* () {
    const essay = yield essay_model_1.default.findById(essayId);
    if (!essay) {
        return null;
    }
    essay.questions.push(itemData);
    return yield essay.save();
});
exports.addEssayItem = addEssayItem;
/**
 * Start an essay assignment
 * @param assignmentId - Essay assignment ID
 * @param userId - User ID
 * @returns The essay assignment and start time
 */
const startEssayAssignment = (assignmentId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const assignment = yield essay_model_1.default.findById(assignmentId);
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
exports.startEssayAssignment = startEssayAssignment;
/**
 * Submit an essay assignment
 * @param submission - Essay submission data
 * @returns The essay submission
 */
const submitEssay = (submission) => __awaiter(void 0, void 0, void 0, function* () {
    const assignment = yield essay_model_1.default.findById(submission.assignmentId);
    if (!assignment) {
        throw new ErrorHandler_1.ErrorHandler('Assignment not found', 404);
    }
    // Check if the assignment is still available for submission
    const currentDate = new Date();
    if (currentDate > assignment.endDate) {
        throw new ErrorHandler_1.ErrorHandler('This assignment has expired, submissions are no longer accepted', 403);
    }
    // Get registration number from user if not provided
    let registrationNumber = submission.registrationNumber;
    if (!registrationNumber) {
        const user = yield user_model_1.default.findById(submission.userId);
        if (!user) {
            throw new ErrorHandler_1.ErrorHandler('User not found', 404);
        }
        registrationNumber = user.registrationNumber;
    }
    const endTime = new Date();
    const timeTaken = (endTime.getTime() - submission.startTime.getTime()) / 60000;
    // Check if time limit is exceeded
    if (timeTaken > assignment.timeLimit) {
        throw new ErrorHandler_1.ErrorHandler('Time limit exceeded', 400);
    }
    let score = 0;
    const processedAnswers = [];
    for (const answer of submission.answers) {
        const question = assignment.questions.find(q => q._id && q._id.toString() === answer.questionId);
        if (question) {
            try {
                const response = yield axios_1.default.post('https://sentence-similarity-pi.vercel.app/similarity', {
                    model_answer: answer.modelAnswer,
                    student_answer: answer.studentAnswer
                });
                // Add similarity score to processed answer
                const processedAnswer = {
                    questionId: new mongoose_1.default.Types.ObjectId(answer.questionId),
                    modelAnswer: answer.modelAnswer,
                    studentAnswer: answer.studentAnswer,
                    similarityScore: response.data.similarity_score
                };
                processedAnswers.push(processedAnswer);
                score += response.data.similarity_score;
            }
            catch (error) {
                console.error('Error calculating similarity:', error);
                // Add answer without similarity score
                processedAnswers.push({
                    questionId: new mongoose_1.default.Types.ObjectId(answer.questionId),
                    modelAnswer: answer.modelAnswer,
                    studentAnswer: answer.studentAnswer,
                    similarityScore: 0
                });
            }
        }
    }
    const essaySubmission = new essaySubmissionModel_1.default({
        assignmentId: new mongoose_1.default.Types.ObjectId(submission.assignmentId),
        userId: new mongoose_1.default.Types.ObjectId(submission.userId),
        registrationNumber,
        answers: processedAnswers,
        score,
        timeTaken,
        submittedAt: endTime,
    });
    yield essaySubmission.save();
    return essaySubmission;
});
exports.submitEssay = submitEssay;
/**
 * Get a specific essay submission
 * @param submissionId - Essay submission ID
 * @returns The essay submission, or null if not found
 */
const getEssaySubmission = (submissionId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield essaySubmissionModel_1.default.findById(submissionId);
});
exports.getEssaySubmission = getEssaySubmission;
/**
 * Get all essay submissions for a specific user
 * @param userId - User ID
 * @returns A list of essay submissions
 */
const getEssaySubmissionsByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield essaySubmissionModel_1.default.find({ userId });
});
exports.getEssaySubmissionsByUser = getEssaySubmissionsByUser;
/**
 * Get all essay submissions for a specific assignment
 * @param assignmentId - Assignment ID
 * @returns A list of essay submissions
 */
const getEssaySubmissionsByAssignment = (assignmentId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield essaySubmissionModel_1.default.find({ assignmentId });
});
exports.getEssaySubmissionsByAssignment = getEssaySubmissionsByAssignment;
const getEssayResultsService = (assignmentId) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate assignmentId
    if (!mongoose_1.default.Types.ObjectId.isValid(assignmentId)) {
        throw new Error('Invalid assignment ID');
    }
    // Aggregate results with user details
    const results = yield essaySubmissionModel_1.default.aggregate([
        // Match submissions for the specific assignment
        {
            $match: {
                assignmentId: new mongoose_1.default.Types.ObjectId(assignmentId)
            }
        },
        // Lookup user details
        {
            $lookup: {
                from: 'users', // Assuming the user collection is named 'users'
                localField: 'userId',
                foreignField: '_id',
                as: 'userDetails'
            }
        },
        // Unwind the user details
        {
            $unwind: {
                path: '$userDetails',
                preserveNullAndEmptyArrays: true
            }
        },
        // Project the desired fields
        {
            $project: {
                _id: 1,
                registrationNumber: '$registrationNumber',
                score: 1,
                timeTaken: 1,
                userId: 1,
                submittedAt: 1,
                studentName: '$userDetails.name', // Assuming the user model has a 'name' field
                essayAnswer: { $arrayElemAt: ['$answers.studentAnswer', 0] }, // Get first answer if multiple
                similarityScore: { $arrayElemAt: ['$answers.similarityScore', 0] } // Get first similarity score
            }
        },
        // Sort by score in descending order
        {
            $sort: { score: -1 }
        }
    ]);
    return {
        success: true,
        results: results
    };
});
exports.getEssayResultsService = getEssayResultsService;
/**
 * Get violation summary for a specific assignment
 * @param assignmentId - ID of the essay assignment
 * @returns Object containing violation summary
 */
const getEssayViolationSummaryService = (assignmentId) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate assignmentId
    if (!mongoose_1.default.Types.ObjectId.isValid(assignmentId)) {
        throw new Error('Invalid assignment ID');
    }
    // Aggregate violations with user details
    const summary = yield essaySubmissionModel_1.default.aggregate([
        // Match submissions for the specific assignment
        {
            $match: {
                assignmentId: new mongoose_1.default.Types.ObjectId(assignmentId)
            }
        },
        // Lookup user details
        {
            $lookup: {
                from: 'users', // Assuming the user collection is named 'users'
                localField: 'userId',
                foreignField: '_id',
                as: 'userDetails'
            }
        },
        // Unwind the user details
        {
            $unwind: {
                path: '$userDetails',
                preserveNullAndEmptyArrays: true
            }
        },
        // Group by student and count violations
        {
            $group: {
                _id: '$userId',
                studentName: { $first: '$userDetails.name' },
                totalViolations: { $sum: 1 }, // You might want to adjust this based on your violation tracking
                violationTypes: { $addToSet: 'Similarity Violation' } // Example violation type
            }
        },
        // Sort by total violations in descending order
        {
            $sort: { totalViolations: -1 }
        }
    ]);
    return {
        success: true,
        summary: summary
    };
});
exports.getEssayViolationSummaryService = getEssayViolationSummaryService;
/**
 * Get a specific student's essay submission for an assignment
 * @param assignmentId - Essay assignment ID
 * @param studentId - Student ID
 * @returns The student's essay submission or null if not found
 */
const getStudentEssaySubmission = (assignmentId, studentId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(assignmentId) || !mongoose_1.default.Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid ID format');
    }
    return yield essaySubmissionModel_1.default.findOne({
        assignmentId: new mongoose_1.default.Types.ObjectId(assignmentId),
        userId: new mongoose_1.default.Types.ObjectId(studentId)
    });
});
exports.getStudentEssaySubmission = getStudentEssaySubmission;
